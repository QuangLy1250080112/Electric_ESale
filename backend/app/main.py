from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from datetime import datetime
import traceback
from collections import deque
import logging

# In-memory log storage
log_records = deque(maxlen=1000)

class MemoryLogHandler(logging.Handler):
    def emit(self, record):
        log_records.appendleft({
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "level": record.levelname,
            "message": self.format(record),
            "name": record.name
        })

# Configure root logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)
memory_handler = MemoryLogHandler()
memory_handler.setFormatter(logging.Formatter('%(message)s'))
logger.addHandler(memory_handler)

# Create FastAPI app instance
app = FastAPI(
    title="ESale Backend API",
    description="Electronics E-commerce Platform API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = datetime.now()
    log_records.appendleft({
        "timestamp": start_time.strftime("%Y-%m-%d %H:%M:%S"),
        "level": "INFO",
        "message": f"API Request: {request.method} {request.url.path}",
        "name": "api"
    })
    try:
        response = await call_next(request)
        process_time = (datetime.now() - start_time).total_seconds()
        log_records.appendleft({
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "level": "INFO" if response.status_code < 400 else "ERROR",
            "message": f"API Response: {request.method} {request.url.path} - Status {response.status_code} - Time {process_time:.4f}s",
            "name": "api"
        })
        return response
    except Exception as e:
        log_records.appendleft({
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "level": "CRITICAL",
            "message": f"API Exception: {request.method} {request.url.path} - {str(e)}\n{traceback.format_exc()}",
            "name": "api"
        })
        raise

from fastapi.staticfiles import StaticFiles
import os

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api/v1")


@app.get("/api/logs", tags=["Logs"])
async def get_logs():
    return list(log_records)


@app.get("/", tags=["Dashboard"], response_class=HTMLResponse)
async def root():
    """Root endpoint - Dashboard"""
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ESale Backend Dashboard</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background-color: #f0f2f5; color: #333; }
            .header { display: flex; justify-content: space-between; align-items: center; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px; }
            .header h1 { margin: 0; color: #1a73e8; }
            .stats { display: flex; gap: 20px; }
            .stat-box { background: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; min-width: 120px; }
            .stat-box h3 { margin: 0 0 10px 0; font-size: 14px; color: #5f6368; }
            .stat-box span { font-size: 24px; font-weight: bold; color: #1a73e8; }
            .log-container { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden; }
            .log-header { padding: 15px 20px; background: #fafafa; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
            .log-header h2 { margin: 0; font-size: 18px; }
            .refresh-btn { background: #1a73e8; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; }
            .refresh-btn:hover { background: #1557b0; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 12px 20px; text-align: left; border-bottom: 1px solid #eee; }
            th { background: #fafafa; font-weight: 600; color: #5f6368; }
            tr:hover { background: #f8f9fa; }
            .level-INFO { color: #1a73e8; font-weight: bold; }
            .level-ERROR { color: #d93025; font-weight: bold; }
            .level-CRITICAL { color: #d93025; font-weight: bold; background: #fce8e6; padding: 2px 6px; border-radius: 4px; }
            .level-WARNING { color: #f29900; font-weight: bold; }
            .msg { font-family: 'Consolas', monospace; font-size: 13px; word-break: break-all; }
            .docs-link { background: #34a853; color: white; text-decoration: none; padding: 8px 16px; border-radius: 4px; font-weight: bold; }
            .docs-link:hover { background: #2d8c47; }
            .pagination { display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-top: 1px solid #eee; background: #fafafa; }
            .pagination button { background: white; border: 1px solid #ddd; padding: 6px 12px; border-radius: 4px; cursor: pointer; color: #5f6368; font-weight: bold; }
            .pagination button:hover:not(:disabled) { background: #f0f2f5; }
            .pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
            .pagination span { color: #5f6368; font-size: 14px; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="header">
            <div>
                <h1>ESale Backend Dashboard</h1>
                <p style="margin: 5px 0 0 0; color: #5f6368;">System monitoring and API logs</p>
            </div>
            <div>
                <a href="/docs" class="docs-link" target="_blank">Swagger API Docs</a>
            </div>
        </div>
        
        <div class="stats">
            <div class="stat-box">
                <h3>Total Requests Logged</h3>
                <span id="total-logs">0</span>
            </div>
            <div class="stat-box">
                <h3>Errors</h3>
                <span id="error-logs" style="color: #d93025;">0</span>
            </div>
            <div class="stat-box">
                <h3>Status</h3>
                <span style="color: #34a853;">Online</span>
            </div>
        </div>
        
        <div class="log-container" style="margin-top: 20px;">
            <div class="log-header">
                <h2>Live System Logs</h2>
                <button class="refresh-btn" onclick="fetchLogs()">Refresh Logs</button>
            </div>
            <table id="log-table">
                <thead>
                    <tr>
                        <th style="width: 180px;">Timestamp</th>
                        <th style="width: 100px;">Level</th>
                        <th style="width: 120px;">Source</th>
                        <th>Message</th>
                    </tr>
                </thead>
                <tbody id="log-body">
                    <tr><td colspan="4" style="text-align: center;">Loading logs...</td></tr>
                </tbody>
            </table>
            <div class="pagination">
                <button id="prev-page" onclick="changePage(-1)" disabled>Previous</button>
                <span id="page-info">Page 1 of 1</span>
                <button id="next-page" onclick="changePage(1)" disabled>Next</button>
            </div>
        </div>

        <script>
            let allLogs = [];
            let currentPage = 1;
            const logsPerPage = 15;

            function renderLogs() {
                const tbody = document.getElementById('log-body');
                tbody.innerHTML = '';
                
                if (allLogs.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No logs available</td></tr>';
                    document.getElementById('page-info').innerText = 'Page 1 of 1';
                    document.getElementById('prev-page').disabled = true;
                    document.getElementById('next-page').disabled = true;
                    return;
                }
                
                const totalPages = Math.ceil(allLogs.length / logsPerPage);
                if (currentPage > totalPages) currentPage = totalPages;
                
                const startIdx = (currentPage - 1) * logsPerPage;
                const endIdx = startIdx + logsPerPage;
                const paginatedLogs = allLogs.slice(startIdx, endIdx);
                
                paginatedLogs.forEach(log => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td style="color: #5f6368; font-size: 13px;">${log.timestamp}</td>
                        <td><span class="level-${log.level}">${log.level}</span></td>
                        <td style="color: #5f6368; font-size: 13px;">${log.name}</td>
                        <td class="msg">${log.message.replace(/\\n/g, '<br>')}</td>
                    `;
                    tbody.appendChild(tr);
                });
                
                document.getElementById('page-info').innerText = `Page ${currentPage} of ${totalPages}`;
                document.getElementById('prev-page').disabled = currentPage === 1;
                document.getElementById('next-page').disabled = currentPage === totalPages;
            }

            function changePage(delta) {
                currentPage += delta;
                renderLogs();
            }

            async function fetchLogs() {
                try {
                    const response = await fetch('/api/logs');
                    allLogs = await response.json();
                    
                    let errorCount = 0;
                    allLogs.forEach(log => {
                        if (log.level === 'ERROR' || log.level === 'CRITICAL') errorCount++;
                    });
                    
                    document.getElementById('total-logs').innerText = allLogs.length;
                    document.getElementById('error-logs').innerText = errorCount;
                    
                    renderLogs();
                } catch (error) {
                    console.error('Error fetching logs:', error);
                }
            }
            
            // Initial fetch
            fetchLogs();
            
            // Auto refresh every 5 seconds
            setInterval(fetchLogs, 5000);
        </script>
    </body>
    </html>
    """
    return HTMLResponse(content=html_content)


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

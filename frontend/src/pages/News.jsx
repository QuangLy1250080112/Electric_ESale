import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import * as newsService from "../services/newsService";
import Loader from "../components/common/Loader";
import { getImageUrl } from "../utils/url";
import {
  Newspaper,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Clock,
} from "lucide-react";
import NewsForm from "../components/news/NewsForm";
import "../styles/News.css";

export default function News() {
  const { user } = useAuthStore();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(0);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getNews(0, 100);
      setNewsList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        await newsService.deleteNews(id);
        fetchNews();
      } catch (err) {
        alert("Lỗi khi xóa bài viết: " + err.message);
      }
    }
  };

  const openAddModal = () => {
    setEditingNews(null);
    setIsModalOpen(true);
  };

  const openEditModal = (news) => {
    setEditingNews(news);
    setIsModalOpen(true);
  };

  const totalPages = Math.ceil(newsList.length / ITEMS_PER_PAGE);
  const paginatedNews = newsList.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <div className="news-page">
      <div className="section-header-centered" style={{ marginTop: '2rem' }}>
        <span className="section-tag">Tin tức</span>
        <h2>
          Tin tức & <span className="gradient-text">Sự kiện</span>
        </h2>
        <p>Cập nhật những thông tin mới nhất từ ESale</p>
      </div>

      <div className="news-container">
        <div className="news-toolbar">
          <div className="news-count">
            Tổng số: <strong>{newsList.length}</strong> bài viết
          </div>
          {(user?.is_admin || user?.is_staff) && (
            <button className="btn btn-primary" onClick={openAddModal}>
              <Plus size={18} />
              <span>Thêm bài viết</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading-center">
            <Loader />
          </div>
        ) : error ? (
          <div className="error-center">
            <p>Đã xảy ra lỗi: {error}</p>
            <button className="btn btn-secondary" onClick={fetchNews}>
              Thử lại
            </button>
          </div>
        ) : newsList.length === 0 ? (
          <div className="empty-center">
            <Newspaper size={48} className="empty-icon" />
            <p>Chưa có bài viết nào.</p>
          </div>
        ) : (
          <div className="news-list">
            {paginatedNews.map((news) => (
              <div key={news.id} className="news-list-item glass-card">
                <Link to={`/news/${news.id}`} className="news-item-link">
                  <div className="news-item-image">
                    <img src={getImageUrl(news.anh_dai_dien)} alt={news.tieu_de} />
                  </div>
                  <div className="news-item-content">
                    <h3>{news.tieu_de}</h3>
                    <p className="news-item-desc">{news.mo_ta_ngan}</p>
                    <div className="news-item-meta">
                      <Clock size={14} />
                      <span>{new Date(news.ngay_dang).toLocaleDateString('vi-VN')}</span>
                      <span className="news-author">Bởi {news.nguoi_viet?.tenTK}</span>
                    </div>
                  </div>
                </Link>
                
                {(user?.is_admin || user?.is_staff) && (
                  <div className="news-item-actions">
                    <button
                      className="btn-icon"
                      onClick={() => openEditModal(news)}
                      title="Sửa"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="btn-icon text-danger"
                      onClick={() => handleDelete(news.id)}
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="pagination-controls" style={{ marginTop: '2rem' }}>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              <ChevronLeft size={20} />
              <span>Trước</span>
            </button>
            <div className="pagination-info">
              Trang <strong>{currentPage + 1}</strong> /{" "}
              <strong>{totalPages}</strong>
            </div>
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              <span>Sau</span>
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <NewsForm
          news={editingNews}
          onClose={() => setIsModalOpen(false)}
          onRefresh={fetchNews}
        />
      )}
    </div>
  );
}

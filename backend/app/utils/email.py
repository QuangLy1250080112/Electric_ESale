import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_verification_email(to_email: str, token: str, action: str):
    """
    Sends an email using Mailtrap for verification or password reset.
    action: 'register' or 'reset_password'
    """
    # Mailtrap config
    smtp_host = 'sandbox.smtp.mailtrap.io'
    smtp_port = 587
    smtp_user = 'e3d76e69541f89'
    smtp_pass = '3a3d04ab8b8397'
    from_email = 'noreply@ESale.local'

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email

    if action == 'register':
        msg['Subject'] = 'Xác thực tài khoản ESale'
        link = f"http://localhost:5173/register?token={token}"
        html = f"""
        <html>
            <body>
                <h2>Chào mừng bạn đến với ESale!</h2>
                <p>Vui lòng nhấn vào nút bên dưới để tiếp tục tạo tài khoản:</p>
                <a href="{link}" style="display:inline-block;padding:10px 20px;background-color:#2563eb;color:white;text-decoration:none;border-radius:5px;">Xác nhận tạo tài khoản</a>
                <p>Nếu bạn không yêu cầu tạo tài khoản, vui lòng bỏ qua email này.</p>
            </body>
        </html>
        """
    elif action == 'reset_password':
        msg['Subject'] = 'Khôi phục mật khẩu ESale'
        link = f"http://localhost:5173/login?token={token}"
        html = f"""
        <html>
            <body>
                <h2>Khôi phục mật khẩu</h2>
                <p>Bạn đã yêu cầu đặt lại mật khẩu tại ESale. Vui lòng nhấn vào nút bên dưới để đặt lại mật khẩu:</p>
                <a href="{link}" style="display:inline-block;padding:10px 20px;background-color:#f59e0b;color:white;text-decoration:none;border-radius:5px;">Đặt lại mật khẩu</a>
                <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            </body>
        </html>
        """
    else:
        return

    msg.attach(MIMEText(html, 'html'))

    try:
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)
        server.quit()
        print(f"Email sent successfully to {to_email} for {action}")
    except Exception as e:
        print(f"Failed to send email: {str(e)}")

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import * as newsService from "../services/newsService";
import Loader from "../components/common/Loader";
import { getImageUrl } from "../utils/url";
import {
  Clock,
  User,
  ArrowLeft,
  Trash2,
  MessageCircle,
  Send
} from "lucide-react";
import "../styles/News.css";

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Comments
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);
      const data = await newsService.getNewsById(id);
      setNews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsDetail();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setSubmittingComment(true);
      await newsService.createComment(id, { noi_dung: commentText });
      setCommentText("");
      fetchNewsDetail(); // Refresh to get new comment
    } catch (err) {
      alert("Lỗi khi thêm bình luận: " + err.message);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
      try {
        await newsService.deleteComment(commentId);
        fetchNewsDetail(); // Refresh
      } catch (err) {
        alert("Lỗi khi xóa bình luận: " + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="news-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader />
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="news-page error-center" style={{ minHeight: '60vh' }}>
        <p>Đã xảy ra lỗi: {error || "Không tìm thấy bài viết"}</p>
        <button className="btn btn-secondary" onClick={() => navigate('/news')}>
          <ArrowLeft size={18} /> Quay lại trang tin tức
        </button>
      </div>
    );
  }

  return (
    <div className="news-detail-page">
      <div className="news-detail-header-nav">
        <button className="btn btn-ghost" onClick={() => navigate('/news')}>
          <ArrowLeft size={18} /> Quay lại
        </button>
      </div>

      <article className="news-article glass-card">
        <h1 className="article-title">{news.tieu_de}</h1>
        
        <div className="article-meta">
          <div className="meta-item">
            <User size={16} />
            <span>{news.nguoi_viet?.tenTK}</span>
          </div>
          <div className="meta-item">
            <Clock size={16} />
            <span>{new Date(news.ngay_dang).toLocaleString('vi-VN')}</span>
          </div>
        </div>

        <div className="article-featured-image">
          <img src={getImageUrl(news.anh_dai_dien)} alt={news.tieu_de} />
        </div>

        <div className="article-description">
          <strong>{news.mo_ta_ngan}</strong>
        </div>

        <div 
          className="article-content ck-content" 
          dangerouslySetInnerHTML={{ __html: news.noi_dung }} 
        />
      </article>

      {/* Comments Section */}
      <section className="comments-section">
        <h3>
          <MessageCircle size={20} /> Bình luận ({news.binh_luan?.length || 0})
        </h3>

        {user ? (
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              placeholder="Nhập bình luận của bạn..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows="3"
              className="form-control"
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={submittingComment || !commentText.trim()}
            >
              {submittingComment ? "Đang gửi..." : <><Send size={16} /> Gửi bình luận</>}
            </button>
          </form>
        ) : (
          <div className="login-to-comment">
            <p>Vui lòng đăng nhập để bình luận.</p>
            <button className="btn btn-outline" onClick={() => navigate('/login')}>
              Đăng nhập
            </button>
          </div>
        )}

        <div className="comments-list">
          {news.binh_luan && news.binh_luan.length > 0 ? (
            news.binh_luan.map((comment) => (
              <div key={comment.id} className="comment-item glass-card">
                <div className="comment-header">
                  <div className="comment-user">
                    <div className="comment-avatar">
                      {comment.nguoi_dung?.tenTK.charAt(0).toUpperCase()}
                    </div>
                    <div className="comment-meta">
                      <strong>{comment.nguoi_dung?.tenTK}</strong>
                      <span className="comment-date">
                        {new Date(comment.ngay_binh_luan).toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>
                  
                  {user?.is_admin && (
                    <button 
                      className="btn-icon text-danger" 
                      onClick={() => handleDeleteComment(comment.id)}
                      title="Xóa bình luận"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="comment-body">
                  {comment.noi_dung}
                </div>
              </div>
            ))
          ) : (
            <div className="no-comments">
              Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect } from "react";
import * as newsService from "../../services/newsService";
import { X, Upload, Check } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { getImageUrl } from "../../utils/url";

export default function NewsForm({ news, onClose, onRefresh }) {
  const [formData, setFormData] = useState({
    tieu_de: "",
    mo_ta_ngan: "",
    noi_dung: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!news;

  useEffect(() => {
    if (news) {
      setFormData({
        tieu_de: news.tieu_de,
        mo_ta_ngan: news.mo_ta_ngan,
        noi_dung: news.noi_dung,
      });
      setImagePreview(getImageUrl(news.anh_dai_dien));
    }
  }, [news]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isEditing && !imageFile) {
      setError("Vui lòng chọn ảnh đại diện");
      return;
    }

    if (!formData.tieu_de || !formData.mo_ta_ngan || !formData.noi_dung) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      setSubmitting(true);
      const submitData = new FormData();
      submitData.append("tieu_de", formData.tieu_de);
      submitData.append("mo_ta_ngan", formData.mo_ta_ngan);
      submitData.append("noi_dung", formData.noi_dung);
      
      if (imageFile) {
        submitData.append("anh_dai_dien", imageFile);
      }

      if (isEditing) {
        await newsService.updateNews(news.id, submitData);
      } else {
        await newsService.createNews(submitData);
      }

      onRefresh();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "Đã xảy ra lỗi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        <div className="modal-header">
          <h2>{isEditing ? "Cập nhật bài viết" : "Thêm bài viết mới"}</h2>
        </div>
        <div className="modal-body">
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit} className="news-form">
            <div className="form-group">
              <label>Ảnh đại diện</label>
              <div className="image-upload-container">
                <input
                  type="file"
                  id="news-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="news-image" className="image-upload-btn">
                  <Upload size={20} /> Chọn ảnh
                </label>
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Tiêu đề bài viết</label>
              <input
                type="text"
                name="tieu_de"
                value={formData.tieu_de}
                onChange={handleChange}
                placeholder="Nhập tiêu đề..."
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Mô tả ngắn</label>
              <textarea
                name="mo_ta_ngan"
                value={formData.mo_ta_ngan}
                onChange={handleChange}
                placeholder="Nhập mô tả ngắn..."
                className="form-control"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label>Nội dung</label>
              <div className="ckeditor-container" style={{ color: '#000' }}>
                <CKEditor
                  editor={ClassicEditor}
                  data={formData.noi_dung}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setFormData((prev) => ({ ...prev, noi_dung: data }));
                  }}
                  config={{
                    toolbar: [
                      'heading', '|',
                      'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|',
                      'outdent', 'indent', '|',
                      'blockQuote', 'insertTable', 'mediaEmbed', 'undo', 'redo'
                    ]
                  }}
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Hủy
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting}
              >
                {submitting ? (
                  "Đang lưu..."
                ) : (
                  <>
                    <Check size={18} /> Lưu bài viết
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

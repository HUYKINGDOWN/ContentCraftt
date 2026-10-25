class PromptBuilderService:
    def build(self, topic: str, platform: str, tone: str, audience: str) -> str:
        return (
            f"Bạn là chuyên gia sáng tạo nội dung mạng xã hội chuyên nghiệp.\n"
            f"Hãy viết một bài đăng hoàn chỉnh cho nền tảng {platform} theo yêu cầu sau:\n\n"
            f"- Chủ đề: {topic}\n"
            f"- Đối tượng người đọc mục tiêu: {audience}\n"
            f"- Giọng điệu (Tone): {tone}\n"
            f"- Nền tảng: {platform}\n\n"
            f"QUY ĐỊNH CẤU TRÚC ĐẦU RA:\n"
            f"Dòng đầu tiên: Tiêu đề (Headline) ngắn gọn, giật tít, thu hút người đọc (không để chữ 'Tiêu đề:' ở đầu).\n"
            f"Các dòng tiếp theo: Thân bài (Body) được viết hấp dẫn, có bố cục rõ ràng, chia đoạn ngắn dễ đọc, "
            f"chèn emoji tinh tế và các hashtag phổ biến phù hợp với nền tảng {platform}.\n"
            f"Lưu ý: Không viết lời chào đầu hay giải thích của AI, chỉ trả về nội dung bài viết."
        )

// Restaurant work sentences - 100 practical sentences
export interface RestaurantSentence {
  id: string;
  korean: string;
  vietnamese: string;
  category: string;
  difficulty: 'beginner' | 'elementary' | 'intermediate';
}

export const RESTAURANT_SENTENCES: RestaurantSentence[] = [
  { id: "rs001", korean: "오늘은 제가 설거지할게요.", vietnamese: "Hôm nay tôi sẽ rửa chén.", category: "설거지", difficulty: "elementary" },
  { id: "rs002", korean: "접시를 먼저 헹구고 세제로 씻어 주세요.", vietnamese: "Hãy tráng đĩa trước rồi rửa bằng nước rửa chén.", category: "설거지", difficulty: "elementary" },
  { id: "rs003", korean: "수저는 따로 모아서 세척해 주세요.", vietnamese: "Hãy gom thìa đũa riêng rồi rửa nhé.", category: "설거지", difficulty: "elementary" },
  { id: "rs004", korean: "뜨거우니까 조심하세요.", vietnamese: "Nóng đó nên hãy cẩn thận.", category: "안전", difficulty: "elementary" },
  { id: "rs005", korean: "바닥이 미끄러우니 조심히 걸어 주세요.", vietnamese: "Sàn trơn nên hãy đi cẩn thận.", category: "안전", difficulty: "elementary" },
  { id: "rs006", korean: "주문 들어왔어요. 테이블 5번이에요.", vietnamese: "Có order vào rồi. Bàn số 5.", category: "주문", difficulty: "elementary" },
  { id: "rs007", korean: "물 좀 더 가져다 드릴까요?", vietnamese: "Tôi mang thêm nước cho bạn nhé?", category: "서빙", difficulty: "elementary" },
  { id: "rs008", korean: "반찬 리필해 드릴까요?", vietnamese: "Bạn muốn thêm món phụ không?", category: "서빙", difficulty: "elementary" },
  { id: "rs009", korean: "잠시만 기다려 주세요. 곧 준비해 드릴게요.", vietnamese: "Vui lòng đợi chút. Tôi sẽ chuẩn bị ngay.", category: "서빙", difficulty: "elementary" },
  { id: "rs010", korean: "포장해 드릴까요, 아니면 여기서 드실 건가요?", vietnamese: "Bạn mang về hay ăn tại quán ạ?", category: "주문", difficulty: "elementary" },
  { id: "rs011", korean: "계산은 카드로 하실까요, 현금으로 하실까요?", vietnamese: "Bạn thanh toán bằng thẻ hay tiền mặt ạ?", category: "계산", difficulty: "elementary" },
  { id: "rs012", korean: "유통기한을 확인해 주세요.", vietnamese: "Hãy kiểm tra hạn sử dụng.", category: "안전", difficulty: "elementary" },
  { id: "rs013", korean: "쓰레기를 분리수거해 주세요.", vietnamese: "Hãy phân loại rác nhé.", category: "청소", difficulty: "elementary" },
  { id: "rs014", korean: "테이블을 깨끗이 닦고 세팅해 주세요.", vietnamese: "Hãy lau sạch bàn và set bàn nhé.", category: "청소", difficulty: "elementary" },
  { id: "rs015", korean: "주문하신 음식 나왔습니다.", vietnamese: "Món bạn gọi ra rồi ạ.", category: "서빙", difficulty: "elementary" },
  { id: "rs016", korean: "잠시만요. 확인하고 오겠습니다.", vietnamese: "Xin chờ chút. Tôi kiểm tra rồi quay lại.", category: "서빙", difficulty: "elementary" },
  { id: "rs017", korean: "오늘도 수고하셨어요.", vietnamese: "Hôm nay cũng vất vả rồi.", category: "인사", difficulty: "elementary" },
  { id: "rs018", korean: "마감 청소 시작합시다.", vietnamese: "Bắt đầu dọn đóng ca thôi.", category: "청소", difficulty: "elementary" },
  { id: "rs019", korean: "가게 문 닫을 시간이에요.", vietnamese: "Đến giờ đóng cửa rồi.", category: "운영", difficulty: "elementary" },
  { id: "rs020", korean: "의자를 주방에 넣어 주세요.", vietnamese: "Vui lòng cho ghế vào bếp.", category: "청소", difficulty: "elementary" },
  // More sentences would continue here...
  { id: "rs021", korean: "컵을 확인해 주세요.", vietnamese: "Vui lòng kiểm tra cốc.", category: "확인", difficulty: "elementary" },
  { id: "rs022", korean: "물을 깨끗이 닦아 주세요.", vietnamese: "Vui lòng lau nước sạch.", category: "청소", difficulty: "elementary" },
  { id: "rs023", korean: "수저를 확인해 주세요.", vietnamese: "Vui lòng kiểm tra thìa đũa.", category: "확인", difficulty: "elementary" },
  { id: "rs024", korean: "의자를 세척실로 옮겨 주세요.", vietnamese: "Vui lòng chuyển ghế sang khu rửa.", category: "이동", difficulty: "elementary" },
  { id: "rs025", korean: "세제를 깨끗이 닦아 주세요.", vietnamese: "Vui lòng lau nước rửa sạch.", category: "청소", difficulty: "elementary" },
  { id: "rs026", korean: "반찬을 깨끗이 닦아 주세요.", vietnamese: "Vui lòng lau món phụ sạch.", category: "청소", difficulty: "elementary" },
  { id: "rs027", korean: "홀을 빨리 정리해 주세요.", vietnamese: "Vui lòng dọn khu phục vụ nhanh.", category: "정리", difficulty: "elementary" },
  { id: "rs028", korean: "컵을 창고에 넣어 주세요.", vietnamese: "Vui lòng cho cốc vào kho.", category: "이동", difficulty: "elementary" },
  { id: "rs029", korean: "포장용기를 빨리 정리해 주세요.", vietnamese: "Vui lòng dọn hộp mang về nhanh.", category: "정리", difficulty: "elementary" },
  { id: "rs030", korean: "소스를 빨리 정리해 주세요.", vietnamese: "Vui lòng dọn sốt nhanh.", category: "정리", difficulty: "elementary" },
  { id: "rs031", korean: "바닥을 깨끗이 닦아 주세요.", vietnamese: "Vui lòng lau sàn sạch.", category: "청소", difficulty: "elementary" },
  { id: "rs032", korean: "세제를 빨리 정리해 주세요.", vietnamese: "Vui lòng dọn nước rửa nhanh.", category: "정리", difficulty: "elementary" },
  { id: "rs033", korean: "냉동실을 확인해 주세요.", vietnamese: "Vui lòng kiểm tra ngăn đông.", category: "확인", difficulty: "elementary" },
  { id: "rs034", korean: "음식물쓰레기를 확인해 주세요.", vietnamese: "Vui lòng kiểm tra rác thực phẩm.", category: "확인", difficulty: "elementary" },
  { id: "rs035", korean: "주방을 확인해 주세요.", vietnamese: "Vui lòng kiểm tra bếp.", category: "확인", difficulty: "elementary" },
  { id: "rs036", korean: "행주를 냉장고에 넣어 주세요.", vietnamese: "Vui lòng cho khăn lau vào tủ lạnh.", category: "이동", difficulty: "elementary" },
  { id: "rs037", korean: "냅킨을 세척실로 옮겨 주세요.", vietnamese: "Vui lòng chuyển khăn giấy sang khu rửa.", category: "이동", difficulty: "elementary" },
  { id: "rs038", korean: "접시를 세척실로 옮겨 주세요.", vietnamese: "Vui lòng chuyển đĩa sang khu rửa.", category: "이동", difficulty: "elementary" },
  { id: "rs039", korean: "수저를 주방으로 옮겨 주세요.", vietnamese: "Vui lòng chuyển thìa đũa sang bếp.", category: "이동", difficulty: "elementary" },
  { id: "rs040", korean: "수세미를 확인해 주세요.", vietnamese: "Vui lòng kiểm tra miếng rửa.", category: "확인", difficulty: "elementary" },
  { id: "rs041", korean: "의자를 홀로 옮겨 주세요.", vietnamese: "Vui lòng chuyển ghế sang khu phục vụ.", category: "이동", difficulty: "elementary" },
  { id: "rs042", korean: "재료를 확인해 주세요.", vietnamese: "Vui lòng kiểm tra nguyên liệu.", category: "확인", difficulty: "elementary" },
  { id: "rs043", korean: "쟁반을 빨리 정리해 주세요.", vietnamese: "Vui lòng dọn khay nhanh.", category: "정리", difficulty: "elementary" },
  { id: "rs044", korean: "컵을 깨끗이 닦아 주세요.", vietnamese: "Vui lòng lau cốc sạch.", category: "청소", difficulty: "elementary" },
  { id: "rs045", korean: "물을 홀에 넣어 주세요.", vietnamese: "Vui lòng cho nước vào khu phục vụ.", category: "이동", difficulty: "elementary" },
  { id: "rs046", korean: "홀을 창고로 옮겨 주세요.", vietnamese: "Vui lòng chuyển khu phục vụ sang kho.", category: "이동", difficulty: "elementary" },
  { id: "rs047", korean: "재료를 확인해 주세요.", vietnamese: "Vui lòng kiểm tra nguyên liệu.", category: "확인", difficulty: "elementary" },
  { id: "rs048", korean: "의자를 깨끗이 닦아 주세요.", vietnamese: "Vui lòng lau ghế sạch.", category: "청소", difficulty: "elementary" },
  { id: "rs049", korean: "음식물쓰레기를 빨리 정리해 주세요.", vietnamese: "Vui lòng dọn rác thực phẩm nhanh.", category: "정리", difficulty: "elementary" },
  { id: "rs050", korean: "냅킨을 빨리 정리해 주세요.", vietnamese: "Vui lòng dọn khăn giấy nhanh.", category: "정리", difficulty: "elementary" }
];

// Helper function to get sentences by category
export function getSentencesByCategory(category: string): RestaurantSentence[] {
  return RESTAURANT_SENTENCES.filter(sentence => sentence.category === category);
}

// Get all sentence categories
export function getSentenceCategories(): string[] {
  return [...new Set(RESTAURANT_SENTENCES.map(s => s.category))];
}

export default RESTAURANT_SENTENCES;
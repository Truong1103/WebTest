# MINI-REPORT: Khai thác dữ liệu sinh viên bằng OOP + Pandas + NumPy

---

## 1. Sơ đồ Pipeline xử lý dữ liệu

```
MySQL Database (university.students)
    ↓
[1] Kết nối & Đọc dữ liệu (pymysql + pandas.read_sql)
    ↓
[2] Kiểm tra & Phân tích Missing Values
    ↓
[3] Định nghĩa OOP Classes
    ├─ Student (entity class)
    ├─ StudentDataProcessor (processing class)
    └─ StudentReport (reporting class)
    ↓
[4] Pipeline xử lý
    ├─ Thống kê mô tả (describe, groupby)
    ├─ Phát hiện Outliers (IQR, Z-score)
    ├─ Top-K analysis
    └─ Tính toán BMI, Age (vectorized)
    ↓
[5] Xuất báo cáo CSV (student_report.csv)
```

---

## 2. Chiến lược xử lý Missing Values

**Phương pháp: Median theo nhóm (major)**

**Lý do:**
- **Robust với outliers**: Median không bị ảnh hưởng bởi giá trị cực đoan (ví dụ: weight_kg có giá trị 120kg)
- **Phù hợp theo ngành**: Sinh viên cùng ngành có đặc điểm tương đồng (ví dụ: AI có thể có GPA cao hơn trung bình)
- **Bảo toàn phân phối**: Giữ nguyên đặc trưng của từng nhóm thay vì làm phẳng dữ liệu

**Công thức áp dụng:**
```python
# Ví dụ: Điền GPA thiếu theo median của major
df['gpa'].fillna(df.groupby('major')['gpa'].transform('median'), inplace=True)
```

**Kết quả:** 1 giá trị GPA thiếu (Pham Thi D - Business Analytics) → điền bằng median của BA = 3.15

---

## 3. Công thức tính toán & Vector hóa NumPy

### BMI (Body Mass Index)
**Công thức:** `BMI = weight_kg / (height_m)²`

**Implementation với NumPy vector hóa:**
```python
df['bmi'] = df['weight_kg'] / ((df['height_cm'] / 100) ** 2)
```

**Lý do dùng vector hóa:**
- **Hiệu suất**: Xử lý toàn bộ cột cùng lúc thay vì loop từng dòng (nhanh hơn 10-100 lần)
- **Tận dụng SIMD**: NumPy sử dụng Single Instruction Multiple Data để tính song song
- **Memory efficient**: Không tạo intermediate objects, tính trực tiếp trên array

### Age (Tuổi)
**Công thức:** `Age = (today - dob).days / 365.25`

**Implementation:**
```python
df['age'] = (datetime.now() - pd.to_datetime(df['dob'])).dt.days // 365
```

**Lý do vector hóa:** Pandas datetime operations được optimize ở C-level, nhanh hơn Python loop rất nhiều.

---

## 4. Kết quả tổng hợp theo Major

| Major | Số SV | GPA TB | GPA Min | GPA Max | Credits TB | Credits Tổng |
|-------|-------|--------|---------|---------|------------|-------------|
| **AI** | 3 | 3.63 | 3.10 | 3.95 | 90.0 | 270 |
| **Business Analytics** | 3 | 3.15 | 2.70 | 3.60 | 76.7 | 230 |
| **Data Science** | 4 | 2.65 | 1.80 | 3.50 | 56.3 | 225 |

### Insight 1: AI có GPA cao nhất nhưng độ phân tán lớn
- **GPA trung bình 3.63** (cao nhất), nhưng có sinh viên GPA 3.95 (Hoang Van E) và 3.10 (Bui Thi H)
- **Nguyên nhân**: Ngành mới, đòi hỏi cao → sinh viên giỏi rất giỏi, yếu thì khó theo kịp

### Insight 2: Data Science có nhiều sinh viên cần hỗ trợ
- **4 sinh viên** nhưng **GPA trung bình thấp nhất (2.65)**
- **2/4 sinh viên** có GPA < 2.5 (Le Van C: 2.1, Pham Van I: 1.8)
- **Khuyến nghị**: Cần chương trình hỗ trợ học tập cho ngành Data Science

---

## 5. Outliers & Chiến lược xử lý

### Phát hiện Outliers:
- **GPA**: 1 outlier (Pham Van I: 1.8) - Z-score = -2.1
- **Weight**: 1 outlier (Hoang Van E: 120kg) - IQR method, BMI = 41.52 (béo phì độ III)

### Chiến lược xử lý:

**1. Capping (Winsorization) cho GPA:**
```python
# Cap ở mức Q1 - 1.5*IQR và Q3 + 1.5*IQR
gpa_lower = df['gpa'].quantile(0.25) - 1.5 * IQR
gpa_upper = df['gpa'].quantile(0.75) + 1.5 * IQR
df['gpa'] = df['gpa'].clip(lower=gpa_lower, upper=gpa_upper)
```
**Lý do**: Giữ lại dữ liệu nhưng giảm ảnh hưởng cực đoan đến thống kê.

**2. Loại bỏ cho Weight (nếu không phải lỗi đo):**
```python
# Xóa nếu BMI > 40 (béo phì độ III - cần xác minh)
df = df[df['bmi'] <= 40]
```
**Lý do**: BMI > 40 có thể là lỗi nhập liệu hoặc cần can thiệp y tế, không phù hợp phân tích học thuật.

---

**Tác giả:** [Tên sinh viên]  
**Ngày:** [Ngày hiện tại]  
**Dataset:** 10 sinh viên, 3 ngành học (AI, Data Science, Business Analytics)


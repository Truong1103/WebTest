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
# Abstract
This report explores a curated student dataset stored in a MySQL schema and processed through an object-oriented Python pipeline that combines Pandas and NumPy. We focus on three broad tasks: auditing data quality, engineering additional health and academic indicators (BMI, age, academic status), and uncovering descriptive insights by major. The resulting analytics support academic advisers with actionable perspectives on performance dispersion, workload distribution, and anomalous records that warrant remediation. Key deliverables include an executable Jupyter notebook, an enriched `student_report.csv`, and the analytical commentary captured in this manuscript.

# 1 Introduction
University advisers increasingly require reproducible analytics to monitor the academic progress and well-being of students across majors. To address this need, we extracted the single-table `students` dataset from the `university` schema and implemented an object-oriented pipeline in Python. The pipeline (i) validates the MySQL connection, (ii) inspects schema metadata and missing values, (iii) instantiates domain classes (`Student`, `StudentDataProcessor`, `StudentReport`), and (iv) generates enriched outputs such as BMI, age, academic standing, outlier diagnostics, and top-k rankings. Additional steps include group-wise imputation (median by major), generation of descriptive dashboards, and export of a production-ready CSV for downstream BI tools. This document summarizes the resulting analyses and provides illustrative LATEX-style sections to align with the requested template.

# 2 Some LaTeX Examples
The following subsections mirror the canonical writeLaTeX scaffold while embedding the findings from our student analytics project.

## 2.1 Sections
Section numbering is handled automatically when authoring in LaTeX. In this Markdown rendition, we mimic the hierarchy to keep the structure clear: Section 1 introduces the motivation and pipeline, Section 2 expands on template-inspired examples, and subsequent items (tables, figures, equations) illustrate how academic narratives can integrate empirical findings. Each subsection ties back to tangible steps in the Python notebook—for example, Section 2.3 mirrors the DataFrame aggregations and Section 2.4 echoes the statistical assumptions used when interpreting GPA distributions.

## 2.2 Comments
Comments within the actual notebook documented every major step—from establishing the PyMySQL connection to exporting `student_report.csv`. Each cell includes concise English annotations (e.g., "Check missing values", "Detect outliers via IQR") to ensure the notebook runs top-to-bottom without ambiguity. This mirrors the intent behind LaTeX comments for collaborative manuscripts, enabling future analysts to replicate the workflow or adapt it for new cohorts with minimal onboarding.

## 2.3 Tables and Figures
Table 1 summarizes the core quantitative indicators grouped by major, while Figure 1 conceptually represents our pipeline (ingestion → quality checks → OOP processing → analytics → CSV export). In a full LaTeX manuscript, the `table` and `figure` environments would wrap the following artifacts, complete with `\caption`, `\label`, and cross-references for seamless navigation.
Complementing Table 1, we also computed top-k leaderboards (top 5 GPA, top 3 credits, bottom 3 GPA) to spotlight both high achievers and students in need of intervention. These rankings help advisors prioritize coaching efforts and resource allocation within each major.

### Figure 1: Conceptual Pipeline
1. Connect to MySQL (`pymysql.connect`)
2. Load table via `pd.read_sql`
3. Instantiate OOP classes (`Student`, `StudentDataProcessor`, `StudentReport`)
4. Run analytics (statistics, outliers, top-k, BMI/Age computation)
5. Export enriched dataset to `student_report.csv`

### Table 1: Descriptive Statistics by Major
| Major               | Students | GPA Mean | GPA Min | GPA Max | Credits Mean | Credits Sum |
|---------------------|----------|----------|---------|---------|--------------|-------------|
| Artificial Intelligence | 3        | 3.63     | 3.10    | 3.95    | 90.0         | 270         |
| Business Analytics      | 3        | 3.15     | 2.70    | 3.60    | 76.7         | 230         |
| Data Science            | 4        | 2.65     | 1.80    | 3.50    | 56.3         | 225         |

## 2.4 Mathematics
Let \(X_1, X_2, \dots, X_n\) denote student-level GPA observations within a given major, with \(\mathbb{E}[X_i] = \mu\) and \(\mathrm{Var}(X_i) = \sigma^2 < \infty\). Define the sample mean
\[
\bar{X}_n = \frac{1}{n} \sum_{i=1}^{n} X_i,
\quad
S_n = \sqrt{n} \left(\bar{X}_n - \mu\right).
\]
By the Central Limit Theorem, \(S_n \xrightarrow{d} \mathcal{N}(0, \sigma^2)\) as \(n \to \infty\). In practice, this justifies approximating the distribution of mean GPA across cohorts, enabling probabilistic statements about academic performance thresholds.

## 2.5 Lists
### Ordered list (progress checkpoints)
1. Establish database connectivity and confirm schema metadata.
2. Audit missing values and address them via group-wise medians.
3. Build OOP abstractions to encapsulate student-level logic.
4. Run analytics (statistics, outliers, top-k, BMI/Age).
5. Export final report and document findings.

### Bulleted list (key insights)
- Artificial Intelligence majors maintain the highest average GPA but exhibit the widest spread, signaling both high performers and students needing guidance.
- Data Science majors show the lowest mean GPA (2.65) with two students below 2.5, indicating an urgent need for academic support programs.

# Conclusion
The English rendition of the report replicates the requested LaTeX-style sections while highlighting substantive findings from the student analytics pipeline. Advisors can rely on these insights to prioritize interventions, refine curricula, and extend the methodology to additional cohorts. Future work may incorporate predictive modeling (e.g., early warning systems) and longitudinal tracking as additional tables/figures in the same LaTeX-ready structure.




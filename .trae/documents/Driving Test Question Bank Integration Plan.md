# Implementation Plan: Driving Test Question Bank Integration

## 1. Data Processing (Python)

Since the source data is in an Excel file, we need to convert it to a format usable by the React frontend.

* **Action**: Create `process_questions.py` script.

* **Logic**:

  * Read `docs/驾考宝典-科目4-顺序题(387).xlsx` using `pandas`.

  * Extract columns (Question, Answer, Options, Type, etc.).

  * Transform into a clean JSON structure.

  * Save to `src/data/questions.json` (or `data/questions.json`).

* **Dependency**: Requires `pandas` and `openpyxl`.

## 2. Type Definitions

* **Action**: Update `types.ts`.

* **Changes**: Add `Question` interface matching the JSON structure.

  ```typescript
  export interface Question {
    id: number;
    question: string;
    answer: string;
    item1: string; // Option A
    item2: string; // Option B
    item3?: string; // Option C
    item4?: string; // Option D
    explains?: string;
    url?: string;
    type: string; // e.g., "判断题", "单选题"
  }
  ```

## 3. Dashboard Update (`pages/Dashboard.tsx`)

* **Action**: Refactor Dashboard to display Question Bank statistics instead of Schedule stats.

* **Changes**:

  * Remove `useSchedules` dependency for stats.

  * Import `questions.json`.

  * **Stats Cards**: Show "Total Questions", "Question Types Count", etc.

  * **Charts**:

    * Pie Chart: Distribution of Question Types (Single Choice vs Multi Choice vs True/False).

    * (Optional) Bar Chart: Difficulty or other available metrics.

## 4. Schedule List Transformation (`pages/ScheduleList.tsx`)

* **Action**: repurpose this page into a "Question Bank Viewer".

* **Changes**:

  * **Search**: Add a fuzzy search bar for question content.

  * **Table View**: Display list of questions.

    * Columns: ID, Question Content (truncated), Type.

  * **Interaction**: Clicking a row opens a **Detail Modal**.

  * **Detail Modal**:

    * Full Question text.

    * Options (A, B, C, D) clearly formatted.

    * Correct Answer highlighted.

    * Explanation text.

## 5. Verification

* Run the python script to generate data.

* Verify JSON content.

* Check Dashboard stats accuracy.

* Test Search functionality in the list view.

* Verify Modal details display correctly.


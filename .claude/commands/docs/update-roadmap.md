---
description: "shrimp-task-manager의 완료된 태스크를 기반으로 ROADMAP.md의 체크박스와 상태 배지를 업데이트합니다"
allowed-tools:
  [
    "Read",
    "Edit",
    "mcp__shrimp-task-manager__list_tasks",
    "Bash(git diff:*)",
    "Bash(git status:*)",
  ]
---

# Claude 명령어: Update Roadmap

shrimp-task-manager에 등록된 태스크 상태를 확인하고, `docs/ROADMAP.md`의 완료 항목을 업데이트합니다.

## 사용법

```
/docs:update-roadmap
```

## 프로세스

### 1단계: 현재 태스크 상태 수집

`mcp__shrimp-task-manager__list_tasks`로 `all` 상태의 태스크 목록을 가져옵니다.

- `completed` 태스크 → ROADMAP.md에서 `✅ 완료` 또는 `[x]`로 표시
- `in_progress` 태스크 → `🚧 진행 중`으로 표시
- `pending` 태스크 → 현재 상태 유지 (변경 없음)

### 2단계: ROADMAP.md 읽기

`docs/ROADMAP.md`를 읽어 현재 상태를 파악합니다.

### 3단계: 매핑 및 업데이트

태스크 이름과 ROADMAP.md 항목을 매핑하여 다음 규칙으로 업데이트합니다.

#### 체크박스 항목 (`- [ ]` → `- [x]`)

태스크가 `completed`이면 해당 항목의 `- [ ]`를 `- [x]`로 변경합니다.

#### 섹션 헤더 상태 배지

모든 하위 항목이 완료되면 섹션 헤더를 업데이트합니다:

| 변경 전        | 변경 후                     |
| -------------- | --------------------------- |
| `❌ 미완료`    | `✅ 완료`                   |
| `⚠️ 부분 완료` | `✅ 완료`                   |
| `🚧 진행 중`   | `✅ 완료`                   |
| `— 대기`       | `🚧 진행 중` (일부 완료 시) |

#### 진행 현황 요약 테이블

ROADMAP.md 하단의 요약 테이블도 실제 진행 상태에 맞게 업데이트합니다.

### 4단계: 변경 내역 보고

업데이트된 항목 목록을 다음 형식으로 보고합니다:

```
## 업데이트 완료

### 변경된 항목
- [Task 이름] → ✅ 완료 처리 (ROADMAP.md 위치: Task X.X)

### 변경 없는 항목
- pending/in_progress 태스크는 변경하지 않음
```

## 매핑 규칙

shrimp-task-manager 태스크 이름과 ROADMAP.md 항목을 아래 기준으로 매핑합니다:

1. **태스크 이름 키워드 일치**: 태스크 이름에 포함된 파일명/기능명으로 ROADMAP 항목 검색
2. **파일 경로 일치**: `relatedFiles`의 경로가 ROADMAP 항목의 파일명과 일치하는지 확인
3. **직접 매핑 불가 시**: 변경하지 않고 보고서에 `⚠️ 매핑 실패` 항목으로 표시

## 주의사항

- ROADMAP.md의 `Phase 5`, `Phase 6` 항목은 shrimp-task-manager에 등록되지 않은 장기 계획이므로 건드리지 않습니다
- `- [ ]` 형식의 체크박스만 업데이트하며, 서술 문장(`- ✅`, `- ❌`)은 별도 판단 후 수정합니다
- **최종 수정일** 필드를 오늘 날짜로 업데이트합니다 (파일 맨 아래 `**최종 수정**:` 라인)

# 🚀 GitHub Pages 배포 가이드

이 문서는 구구단 산성비 게임을 GitHub Pages에 배포하는 방법을 안내합니다.

## 📋 배포 단계

### 1단계: GitHub 저장소 생성

1. [GitHub](https://github.com)에 로그인합니다
2. 우측 상단의 `+` 버튼 클릭 → `New repository` 선택
3. 저장소 정보 입력:
   - **Repository name**: `multiplication-rain-game` (원하는 이름)
   - **Description**: "초등학생을 위한 구구단 학습 게임"
   - **Public** 선택 (GitHub Pages 무료 사용)
4. `Create repository` 클릭

### 2단계: base 경로 설정

저장소 이름에 맞게 `vite.config.ts` 파일을 수정하세요:

```typescript
export default defineConfig({
  plugins: [react()],
  base: '/저장소이름/', // 예: '/multiplication-rain-game/'
})
```

**중요**: 
- 저장소 이름이 `username.github.io`인 경우: `base: '/'` 사용
- 일반 저장소인 경우: `base: '/저장소이름/'` 사용

### 3단계: Git 초기화 및 커밋

터미널에서 다음 명령어 실행:

```bash
# Git 저장소 초기화
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit: 구구단 산성비 게임"

# 기본 브랜치를 main으로 변경
git branch -M main

# GitHub 저장소 연결 (YOUR_USERNAME를 본인 GitHub 아이디로 변경)
git remote add origin https://github.com/YOUR_USERNAME/multiplication-rain-game.git

# 푸시
git push -u origin main
```

### 4단계: GitHub Pages 활성화

1. GitHub 저장소 페이지로 이동
2. `Settings` 탭 클릭
3. 왼쪽 메뉴에서 `Pages` 선택
4. **Source** 섹션에서:
   - Source: `GitHub Actions` 선택
5. 자동으로 배포가 시작됩니다

### 5단계: 배포 확인

1. GitHub 저장소의 `Actions` 탭에서 배포 진행 상황 확인
2. 배포 완료 후 다음 URL에서 게임 접속:
   ```
   https://YOUR_USERNAME.github.io/multiplication-rain-game/
   ```

## 🔄 업데이트 배포

코드를 수정한 후:

```bash
git add .
git commit -m "수정 내용 설명"
git push
```

푸시하면 자동으로 재배포됩니다!

## 🛠️ 문제 해결

### 배포 후 페이지가 비어있는 경우

**원인**: `base` 경로가 잘못 설정됨

**해결**:
1. `vite.config.ts`에서 `base` 값 확인
2. 저장소 이름과 일치하는지 확인
3. 수정 후 다시 푸시

### 404 에러가 발생하는 경우

**원인**: GitHub Pages가 활성화되지 않음

**해결**:
1. Settings → Pages에서 Source를 `GitHub Actions`로 설정
2. Actions 탭에서 워크플로우가 성공했는지 확인

### CSS/JS 파일이 로드되지 않는 경우

**원인**: `base` 경로 문제

**해결**:
```typescript
// vite.config.ts
base: '/저장소이름/', // 끝에 슬래시(/) 필요!
```

## 📱 커스텀 도메인 (선택사항)

자신의 도메인을 사용하려면:

1. `public` 폴더에 `CNAME` 파일 생성
2. 내용: `yourdomain.com`
3. DNS 설정에서 GitHub Pages IP 주소 추가

자세한 내용: [GitHub 공식 문서](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)

## 🎉 배포 완료!

배포가 완료되면 전 세계 어디서든 게임에 접속할 수 있습니다!

URL 예시:
- https://yourusername.github.io/multiplication-rain-game/

친구들과 선생님, 학부모님께 링크를 공유해보세요! 🚀


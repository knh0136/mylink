# MyLink

한양대학교 바이브코딩 수업에서 만드는 개인 프로필 및 링크 모음 서비스입니다.

실제 Next.js 프로젝트는 [`mylink/`](./mylink/) 폴더에 있습니다. 강의자료는 저장소에 포함하지 않습니다.

## 실행

Node.js 20.9 이상을 설치한 뒤 다음 명령을 실행합니다.

```sh
cd mylink
npm ci
npm run dev
```

브라우저에서 <http://localhost:3000>을 엽니다.

Windows에서는 저장소 루트의 `preview.cmd`를 실행해 빌드된 화면을 미리 볼 수 있습니다. 시스템의 Node.js 또는 이 작업에서 준비한 임시 Node.js를 찾아 사용합니다. 안내된 주소를 브라우저에서 열고, 미리보기를 종료하려면 콘솔에서 Ctrl+C를 누릅니다.

## 구현 기능

- 프로필과 링크 목록, 외부 링크 새 탭 열기
- 프로필 이름·이니셜·소개 편집
- 링크 추가·수정·삭제 및 입력 검증
- 삭제 확인 대화상자, 저장 알림, 키보드 접근성
- 모바일 반응형 화면
- 브라우저 localStorage 저장과 다른 탭의 변경 내용 반영
- 페이지 주소 복사와 복사 실패 시 수동 복사

공개 페이지는 `/`, 편집 페이지는 `/mypage/`입니다. 로그인은 없는 실습용 앱입니다.

## 저장 방식과 공유

편집 내용은 **현재 브라우저와 사이트 주소에만** 저장됩니다. 페이지를 새로고침해도 유지되지만 다른 기기·브라우저 또는 다른 방문자에게 동기화되지는 않습니다. 브라우저 데이터를 삭제하면 기본 프로필로 돌아갑니다. 방문자도 자기 브라우저 안에서만 자유롭게 편집할 수 있습니다.

모든 방문자에게 보이는 기본 내용을 변경하려면 `mylink/data/defaults.ts`를 수정하고 다시 배포합니다. 추후 Firebase를 연결할 때는 `lib/repository.ts`의 저장 계층부터 교체할 수 있습니다.

## 검증 및 빌드

```sh
cd mylink
npm run typecheck
npm run build
npm test
```

`npm test`는 설치된 Microsoft Edge로 브라우저 테스트를 실행합니다. Edge가 없는 환경에서는 `npx playwright install chromium` 후 `PLAYWRIGHT_BROWSER=chromium` 환경 변수로 실행할 수 있습니다.

빌드 결과는 `mylink/out/`에 만들어집니다.

## Vercel 배포

1. GitHub의 `knh0136/mylink` 저장소를 Vercel에서 가져옵니다.
2. Framework Preset은 **Next.js**, Root Directory는 **mylink**로 지정합니다.
3. 환경 변수 없이 배포할 수 있습니다.
4. 배포된 `/`와 `/mypage/`에 직접 접속하고, 로그아웃한 브라우저에서도 공개 페이지가 열리는지 확인합니다.

## 강의와의 연결

Next.js와 shadcn/ui로 화면을 만들고, 6주차 링크 목록, 7주차 입력 검증, 10주차 링크 수정과 삭제 확인을 반영했습니다. 편집 UI는 대화상자로 구성했습니다. 이번 버전은 Firestore 대신 localStorage를 사용합니다. Google 로그인·클라우드 동기화·개인별 동적 URL·클릭 통계는 최종 버전에서 확장할 수 있습니다.

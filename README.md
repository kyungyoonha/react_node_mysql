### CSRF 공격

-   Cross-Site Request Fogery
-   웹 사이트 취약점 공격의 하나
-   자신의 의지와는 무관하게 공격자가 의도한 행위(수정, 삭제, 등록) 등을 특정 웹사이트에 요청하게 하는 공격을 말한다.
-   CSRF 공격을 막기 위해서 서버에 토큰을 발행해 클라이언트로 보내주고 클라이언트에서 글 작성 시 서버에서 생성한 토큰과 맞는지 값을 비교해준 후에 토큰이 일치하는 경우에만 글을 작성하도록 구현한다.

## 노드

---

#### path

```javascript
// __dirname => 현재 디렉토리
// C:\Users\gkb10\Desktop\react_node_mysql\server\routes
const path = require("path");
const uploadDir = path.join(__dirname, "../uploads");
// C:\Users\gkb10\Desktop\react_node_mysql\server\uploads
```

#### Static file

```javascript
// 업로드 path 추가
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));
```

### 모듈

-   #### express-paginate
-   #### socket.io

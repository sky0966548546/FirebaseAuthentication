# 第三方登入系統 - Google 登入
利用 Firebase 來儲存登入的資料，且可以直接從 Firebase SDK 中的 function 來取得會員資料。

# 建立 Firebase 專案
進入 [Firebase](https://firebase.google.com/) 的頁面並且登入帳號，即可新增專案

![新增專案](https://i.imgur.com/auyVR8x.png)

專案新增完後，首頁上將會看到新增應用程式的訊息，點選表示「網頁」的 icon 就會開始新增網頁應用程式

![點擊 icon](https://i.imgur.com/xyca8yr.png)

輸入完應用程式暱稱並新增完成後，就會看見我們所要在網頁上要引用的 Firebase SDK 了

![Firebase SDK](https://i.imgur.com/EFmteq3.png)

照著說明複制這一段的程式碼至 HTML 檔案中的 **<body>**  的最下方處

```htmlmixed=
<script src="https://www.gstatic.com/firebasejs/8.2.4/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.2.4/firebase-analytics.js"></script>
<script type="module">
    let firebaseConfig = {
        apiKey:
        authDomain:
        projectId:
        storageBucket:
        messagingSenderId:
        appId:
        measurementId:
    };

    firebase.initializeApp(firebaseConfig);
</script>
```

# 開通 Google Authentication 功能
Firebase 專案及應用程式建立完後，從左側選單點選「Authentication」，接著右側會出現「設定登入方式」的按鈕

![設定登入方式](https://i.imgur.com/YpWCh0b.png)

接著點選「Google」，來進行設定

![Google登入](https://i.imgur.com/v8BXrWW.png)

除了「Google登入」還有許多的登入方式，可進行設定

![許多的登入方式](https://i.imgur.com/JG0O8gW.png)

頁面再往下拉，出現「已授權網域」的列表

![已授權網域](https://i.imgur.com/IktmHSo.png)

在以下的網域才可以進行使用 Firebase Auth 的功能，如果不在這份列表內的網域一律會報錯，如果要新增網域，點選右上角的「新增網域」，即可新增網域

> 目前為止引用了 SDK ，開啟了 Auth 功能以及設定可使用的網域，接著就要寫程式碼來使用了

# Google 登入
Google 的登入有二種模式，一種是跳出一個 Popup 的視窗，在視窗中讓使用者登入自己的 Google 帳號；另一種是原頁跳轉到 Google 的登入頁面，登入後回到原始頁面用 function 去取得使用者資料，我所使用的是使用 Popup 的視窗來進行登入

### **Popup 範本**

```javascript=
const provider = new firebase.auth.GoogleAuthProvider();
firebase.auth().signInWithPopup(provider).then(result => {
    let credential = result.credential;
    let token = credential.accessToken;
    let user = result.user;
}).catch(error => {
    let errorCode = error.code;
    let errorMessage = error.message;
    let email = error.email;
    let credential = error.credential;
}); // Error Data
```

user 是使用者的資料，可以將一部分資料抓下來儲存到資料庫當中

```
user.displayName: 顯示名稱
user.email: 電子信箱
user.emailVerified: 這個電子信箱是否有驗證
user.photoURL: 頭像的路徑
user.uid: Firebase Auth 派給這個使用者的 User ID
```

## 介面

因為我只用 Google 登入，所以需要的標籤比較少。

### 登入

只有一個使用 Google 登入的按鈕，但是看起來有點空虛，所以又加了兩個不能用的輸入框來美化介面

![登入介面](https://i.imgur.com/dKVwLlo.png)

```
<button id="signIn" type="button" class="btn waves-effect green"><i class="fa fa-google-plus"></i> Google 登入</button>
```

### 登入成功

歡迎標題、用戶資訊、登出 / 刪除帳號鈕，這邊有的東西就比較多了，更詳細的程式碼後面會寫到

![登入成功介面](https://i.imgur.com/XO3nTst.png)

```
<h4><i class="fa fa-snowflake-o"></i> 歡迎 !!! ${name}</h4>
<div class="card white">
    <div class="card-content blue-text">
        <img src="${image}" class="photo">
        <p>你的名稱：${name}</p>https://i.imgur.com/XO3nTst.png
        <p>你的 Email ：${email}</p>
        <p>Email 是否已驗證：${emailVerified}</p>
    </div>
    <div class="card-action">
        <button class="btn waves-effect indigo" onclick="SignOut();">登出</button>
        <button class="btn waves-effect red" onclick="DeleteUser();">刪除帳號</button>
    </div>
</div>
```

## 函數

總共要做三種功能：登入、登出、刪除帳號

### 登入

由 Popup 的範本再做延伸

```javascript=
// SignIn
function SignIn() {
  firebase.auth().signInWithPopup(providerGoogle).then(e => { 
  e.credential.accessToken; 
  const n = e.user;    // 全部的資料，為 Json 檔
  const name = JSON.stringify(n.displayName).replace('"',"").replace('"',"");    // 取得帳戶的名稱，並且刪除 ""
  const email = JSON.stringify(n.email).replace('"',"").replace('"',"");    // 取得電子郵件
  const emailVerified = JSON.stringify(n.emailVerified).replace('"',"").replace('"',"");    // 確認電子郵件是否通過驗證，變數為布林值
  const image = JSON.stringify(n.photoURL).replace('"',"").replace('"',"");    // 取得帳戶圖片的網址

  document.getElementById("login").style.display="none";  // 隱藏登入介面

  finish.innerHTML =
   `<h4><i class="fa fa-snowflake-o"></i> 歡迎 !!! ${name}</h4>
    <div class="card white">
      <div class="card-content blue-text">
        <img src="${image}" class="photo">
        <p>你的名稱：${name}</p>
        <p>你的 Email ：${email}</p>
        <p>Email 是否已驗證：${emailVerified}</p>
      </div>
      <div class="card-action">
        <button class="btn waves-effect indigo" onclick="SignOut();">登出</button>
        <button class="btn waves-effect red" onclick="DeleteUser();">刪除帳號</button>
      </div>
    </div>`
  }).catch(e => console.log(JSON.stringify(e)))  // Print Error
}
```

### 登出

```javascript=
// SignOut
function SignOut() { 
    firebase.auth().signOut().then(() => { 
        window.alert("登出成功，將重新整理一次頁面！"), 
        window.location.reload();   // 重新整理頁頁
    }).catch(e => console.log(JSON.stringify(e)))   // Print Error
}
```

### 刪除帳號

```javascript=
// DeleteUser
function DeleteUser() { 
    let e = firebase.auth().currentUser; 
    e.delete().then(() => { 
        window.alert("刪除成功，將重新整理一次頁面！");
        window.location.reload();
    }).catch(e => console.log(JSON.stringify(e)))   // Print Error
} 
```

# 查看目前註冊人數

回到在 firebase 所新增的專案，點選「Authentication」中的「Users」，即可查看目前所註冊的人數及資料

![註冊人數](https://i.imgur.com/5Fwpczr.png)

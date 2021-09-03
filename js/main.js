let providerGoogle = new firebase.auth.GoogleAuthProvider();
let signIn = document.getElementById("signIn");
let signOut = document.getElementById("signOut");
let deleteUser = document.getElementById("deleteUser");
let login = document.getElementById("login");
let finish = document.getElementById("finish");

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

// SignOut
function SignOut() { 
    firebase.auth().signOut().then(() => { 
        window.alert("登出成功，將重新整理一次頁面！"), 
        window.location.reload();   // 重新整理頁頁
    }).catch(e => console.log(JSON.stringify(e)))   // Print Error
}

// DeleteUser
function DeleteUser() { 
    let e = firebase.auth().currentUser; 
    e.delete().then(() => { 
        window.alert("刪除成功，將重新整理一次頁面！");
        window.location.reload();
    }).catch(e => console.log(JSON.stringify(e)))   // Print Error
} 

// 點擊事件
signIn.addEventListener("click", SignIn)
const state={
  user:JSON.parse(localStorage.getItem("vyvo_user")||"null"),
  page:"home",
  liked:new Set(),
  saved:new Set(),
  followed:new Set(),
  posts:[],
  comments:[
    {user:"alexvyvo",text:"This looks amazing! 🔥"},
    {user:"travelwave",text:"Love the vibe ✨"}
  ]
};

const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const content=$("#content"), landing=$("#landing"), dashboard=$("#dashboard"), authOverlay=$("#authOverlay");
const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));

function toast(msg){
  const el=document.createElement("div");
  el.className="toast";
  el.textContent=msg;
  $("#toasts").appendChild(el);
  setTimeout(()=>el.remove(),2800);
}

function showAuth(type="login"){
  authOverlay.classList.remove("hidden");
  $("#loginForm").classList.toggle("hidden",type!=="login");
  $("#signupForm").classList.toggle("hidden",type!=="signup");
}

function closeAuth(){
  authOverlay.classList.add("hidden");
}

function login(user={name:"Rishav",username:"rishavvyvo"}){
  state.user=user;
  localStorage.setItem("vyvo_user",JSON.stringify(user));
  closeAuth();
  landing.classList.add("hidden");
  dashboard.classList.remove("hidden");
  render("home");
}

function logout(){
  localStorage.removeItem("vyvo_user");
  state.user=null;
  dashboard.classList.add("hidden");
  landing.classList.remove("hidden");
  toast("Logged out successfully");
}

function stories(){
  return `<div class="stories">
    <div class="story"><div class="avatar story-add">＋</div><span>Your story</span></div>
    ${["A","T","S","M","K"].map((x,i)=>`
      <div class="story" data-story="${i}">
        <div class="avatar ${["a2","a3","a4","gradient-avatar","a2"][i]}">${x}</div>
        <span>${["alex","travel","space","mira","kai"][i]}</span>
      </div>`).join("")}
  </div>`;
}

const demoPosts=[
  {
    id:1,user:"alexvyvo",name:"Alex Carter",time:"12 min",avatar:"A",
    media:"media-1",art:"VYVO",
    caption:"Building a little corner of the internet where creativity feels alive. ✨",
    likes:2481,comments:42
  },
  {
    id:2,user:"travelwave",name:"Travel Wave",time:"38 min",avatar:"T",
    media:"media-2",art:"EXPLORE",
    caption:"New places. New perspectives. One frame at a time. 🌍",
    likes:1872,comments:31
  }
];

function postHTML(p){
  const liked=state.liked.has(p.id);
  const saved=state.saved.has(p.id);

  return `<article class="post" data-post="${p.id}">
    <div class="post-head">
      <span class="avatar ${p.avatar==="A"?"a2":"a3"}">${p.avatar}</span>
      <div><b>@${p.user}</b><small>${p.time} · Public</small></div>
      <button class="more">•••</button>
    </div>

    <div class="post-media ${p.media}" data-like-image="${p.id}">
      <div class="media-art">${p.art}</div>
    </div>

    <div class="post-body">
      <div class="post-actions">
        <button class="${liked?"liked":""}" data-like="${p.id}" aria-label="Like post">${liked?"♥":"♡"}</button>
        <button data-comments="${p.id}" aria-label="Comments">◌</button>
        <button data-share="${p.id}" aria-label="Share">↗</button>
        <button class="save ${saved?"liked":""}" data-save="${p.id}" aria-label="Save">⌑</button>
      </div>

      <b>${p.likes+(liked?1:0)} likes</b>
      <p><strong>@${p.user}</strong> ${escapeHTML(p.caption)}</p>
      <p class="hashtags">#VYVO #Create #Explore</p>
      <button class="comment-link" data-comments="${p.id}">View all ${p.comments} comments</button>
    </div>
  </article>`;
}

function homePage(){
  return `
    <div class="feed-title"><h2>For you</h2><button class="link-btn">Latest</button></div>
    ${stories()}
    ${demoPosts.map(postHTML).join("")}
  `;
}

function explorePage(){
  return `
    <div class="page-header"><h1>Explore</h1><button class="secondary-btn">Trending</button></div>
    <div class="explore-search">⌕<input id="exploreSearch" placeholder="Search creators, posts, hashtags..."></div>
    <div class="grid">
      ${Array.from({length:18},(_,i)=>`
        <div class="grid-item" data-grid="${i}">
          ${["VYVO","ART","TECH","TRAVEL","MUSIC","CREATE"][i%6]}
        </div>`).join("")}
    </div>
  `;
}

function reelsPage(){
  return `
    <div class="page-header"><h1>Reels</h1><button class="link-btn">Following</button></div>
    <div class="reel">
      <div class="reel-art">VYVO</div>
      <div class="reel-overlay">
        <b>@creativehub</b>
        <p>Turn your ideas into something people remember. ✨</p>
        <span class="hashtags">#VYVO #Creator #Reels</span>
      </div>
      <div class="reel-actions">
        <button data-reel-like>♥</button>
        <button data-reel-comment>◌</button>
        <button data-share="reel">↗</button>
        <button>⌑</button>
      </div>
    </div>
  `;
}

function createPage(){
  return `
    <div class="page-header"><h1>Create Post</h1></div>
    <div class="create-card">
      <h3>Share something with VYVO</h3>

      <div class="upload-zone" id="uploadZone">
        ＋<br>
        <b>Choose a photo or video</b><br>
        <small>Demo preview — files are not uploaded to a server.</small>
        <input id="mediaInput" type="file" accept="image/*,video/*" hidden>
      </div>

      <textarea id="postCaption" placeholder="Write a caption..."></textarea>

      <div class="create-options">
        <button class="option-chip">⌖ Add location</button>
        <button class="option-chip">＠ Tag people</button>
        <button class="option-chip"># Add hashtags</button>
        <button class="option-chip">◉ Audience: Public</button>
      </div>

      <button class="primary-btn full" data-publish>Publish Post</button>
    </div>
  `;
}

function profilePage(){
  return `
    <div class="profile-cover"></div>

    <div class="profile-info">
      <div class="profile-main-row">
        <div>
          <div class="avatar gradient-avatar">R</div>
          <h2>Rishav</h2>
          <p class="muted">@rishavvyvo</p>
        </div>

        <div class="profile-actions">
          <button class="secondary-btn" data-edit-profile>Edit Profile</button>
          <button class="primary-btn" data-follow-profile>Follow</button>
        </div>
      </div>

      <p>Creator · Builder · Exploring new ideas 🚀</p>

      <div class="stats">
        <div><b>24</b><span>Posts</span></div>
        <div><b>1.8K</b><span>Followers</span></div>
        <div><b>326</b><span>Following</span></div>
      </div>

      <div class="grid">
        ${Array.from({length:9},(_,i)=>`
          <div class="grid-item">${["VYVO","BUILD","CODE","CREATE","PLAY","IDEAS"][i%6]}</div>
        `).join("")}
      </div>
    </div>
  `;
}

function notificationsPage(){
  const items=[
    "Alex liked your post.",
    "Travel Wave started following you.",
    "Mira commented on your post.",
    "Techspace mentioned you in a post.",
    "You have a new message from Kai."
  ];

  return `
    <div class="page-header">
      <h1>Notifications</h1>
      <button class="link-btn">Mark all read</button>
    </div>

    <div class="panel">
      ${items.map((x,i)=>`
        <div class="suggestion">
          <span class="avatar ${i%2?"a3":"a2"}">${["A","T","M","T","K"][i]}</span>
          <div><b>${x}</b><small>${i+1}h ago</small></div>
          ${i<3?"<span>●</span>":""}
        </div>
      `).join("")}
    </div>
  `;
}

function messagesPage(){
  return `
    <div class="page-header">
      <h1>Messages</h1>
      <button class="secondary-btn">New message</button>
    </div>

    <div class="chat-card chat-layout">
      <div class="chat-list">
        ${["alexvyvo","travelwave","techspace","mira"].map((u,i)=>`
          <div class="conversation ${i===0?"active":""}" data-chat="${u}">
            <span class="avatar ${i%2?"a3":"a2"}">${u[0].toUpperCase()}</span>
            <div><b>@${u}</b><small>${i===0?"See you soon!":"Active recently"}</small></div>
          </div>
        `).join("")}
      </div>

      <div class="chat-window">
        <div class="messages">
          <div class="bubble">Hey! Welcome to VYVO 👋</div>
          <div class="bubble me">Thanks! This is looking great.</div>
          <div class="bubble">See you around the community ✨</div>
        </div>

        <div class="chat-input">
          <input id="chatInput" placeholder="Write a message...">
          <button class="primary-btn" data-send-message>Send</button>
        </div>
      </div>
    </div>
  `;
}

function settingsPage(){
  return `
    <div class="page-header"><h1>Settings</h1></div>

    <div class="settings-card">
      <div class="settings-row">
        <div><b>Account</b><small>Edit your profile and account details</small></div>
        <button class="secondary-btn">Manage</button>
      </div>

      <div class="settings-row">
        <div><b>Notifications</b><small>Likes, comments, followers and messages</small></div>
        <button class="toggle on"></button>
      </div>

      <div class="settings-row">
        <div><b>Private account</b><small>Only approved followers can see your posts</small></div>
        <button class="toggle"></button>
      </div>

      <div class="settings-row">
        <div><b>Dark mode</b><small>Use VYVO's dark appearance</small></div>
        <button class="toggle on"></button>
      </div>

      <div class="settings-row">
        <div><b>Security</b><small>Login activity and account security</small></div>
        <button class="secondary-btn">Open</button>
      </div>

      <div class="settings-row">
        <div><b>About VYVO</b><small>Privacy · Terms · Help · Contact</small></div>
        <button class="link-btn">View</button>
      </div>
    </div>
  `;
}

function render(page=state.page){
  state.page=page;

  const pages={
    home:homePage,
    explore:explorePage,
    reels:reelsPage,
    create:createPage,
    profile:profilePage,
    notifications:notificationsPage,
    messages:messagesPage,
    settings:settingsPage
  };

  content.innerHTML=(pages[page]||homePage)();

  $$("[data-page]").forEach(b=>{
    b.classList.toggle("active",b.dataset.page===page);
  });

  $("#miniName").textContent=state.user?.name||"Rishav";

  bindPageEvents();
}

function openModal(html){
  $("#modalCard").innerHTML=html;
  $("#modal").classList.remove("hidden");
}

function closeModal(){
  $("#modal").classList.add("hidden");
}

function commentsModal(id){
  const p=demoPosts.find(x=>x.id===id);

  openModal(`
    <div class="page-header">
      <h2>Comments</h2>
      <button class="close-btn" data-close-modal>×</button>
    </div>

    ${state.comments.map(c=>`
      <div class="comment">
        <span class="avatar">${c.user[0].toUpperCase()}</span>
        <div><b>@${c.user}</b><br>${escapeHTML(c.text)}</div>
      </div>
    `).join("")}

    <div class="comment-form">
      <input id="commentInput" placeholder="Add a comment...">
      <button class="primary-btn" data-add-comment="${id}">Post</button>
    </div>
  `);

  const add=$("#modalCard [data-add-comment]");
  add?.addEventListener("click",()=>{
    const input=$("#commentInput");
    const text=input.value.trim();

    if(!text){
      toast("Write a comment first");
      return;
    }

    state.comments.push({
      user:state.user?.username||"rishavvyvo",
      text
    });

    commentsModal(id);
    toast("Comment added");
  });
}

function bindPageEvents(){
  $$("[data-like]").forEach(b=>b.onclick=()=>{
    const id=+b.dataset.like;

    state.liked.has(id)
      ? state.liked.delete(id)
      : state.liked.add(id);

    render(state.page);
    toast(state.liked.has(id)?"Post liked ❤️":"Like removed");
  });

  $$("[data-like-image]").forEach(x=>x.onclick=()=>{
    const id=+x.dataset.likeImage;
    state.liked.add(id);
    render(state.page);
    toast("Post liked ❤️");
  });

  $$("[data-save]").forEach(b=>b.onclick=()=>{
    const id=+b.dataset.save;

    state.saved.has(id)
      ? state.saved.delete(id)
      : state.saved.add(id);

    render(state.page);
    toast(state.saved.has(id)?"Saved to your collection":"Removed from saved");
  });

  $$("[data-comments]").forEach(b=>{
    b.onclick=()=>commentsModal(+b.dataset.comments);
  });

  $$("[data-share]").forEach(b=>b.onclick=async()=>{
    try{
      await navigator.clipboard.writeText(location.href);
    }catch{}
    toast("Share link copied");
  });

  $$("[data-story]").forEach(b=>{
    b.onclick=()=>openModal(`
      <div class="reel">
        <div class="reel-art">${["ALEX","TRAVEL","SPACE","MIRA","KAI"][+b.dataset.story]}</div>
        <button class="close-btn" data-close-modal>×</button>
        <div class="reel-overlay"><b>Story</b><p>Demo story on VYVO.</p></div>
      </div>
    `);
  });

  $$("[data-follow-profile],.follow-mini").forEach(b=>{
    b.onclick=()=>{
      b.textContent=b.textContent==="Follow"?"Following":"Follow";
      toast(b.textContent==="Following"?"Following successfully":"Unfollowed");
    };
  });

  $("[data-edit-profile]")?.addEventListener("click",()=>{
    openModal(`
      <h2>Edit Profile</h2>
      <label>Display name<input value="${escapeHTML(state.user?.name||"Rishav")}"></label>
      <label>Bio<input value="Creator · Builder · Exploring new ideas 🚀"></label>
      <button class="primary-btn full" data-close-modal>Save changes</button>
    `);
  });

  $("[data-publish]")?.addEventListener("click",()=>{
    const cap=$("#postCaption").value.trim();

    if(!cap){
      toast("Add a caption first");
      return;
    }

    toast("Demo post published ✨");
    $("#postCaption").value="";
  });

  $("[data-send-message]")?.addEventListener("click",()=>{
    const input=$("#chatInput");

    if(input.value.trim()){
      toast("Message sent");
      input.value="";
    }
  });

  $("[data-reel-like]")?.addEventListener("click",e=>{
    e.currentTarget.textContent="♥";
    toast("Reel liked ❤️");
  });

  $("[data-reel-comment]")?.addEventListener("click",()=>{
    toast("Reel comments opened");
  });

  $$(".toggle").forEach(t=>{
    t.onclick=()=>t.classList.toggle("on");
  });

  const upload=$("#uploadZone");
  const input=$("#mediaInput");

  if(upload&&input){
    upload.onclick=e=>{
      if(e.target!==input) input.click();
    };

    input.onchange=()=>{
      if(input.files[0]){
        upload.innerHTML=`
          ✓ ${escapeHTML(input.files[0].name)}
          <br><small>Selected for demo preview</small>
        `;
      }
    };
  }
}

document.addEventListener("click",e=>{
  const pageBtn=e.target.closest("[data-page]");

  if(pageBtn){
    render(pageBtn.dataset.page);
    $("#sidebar")?.classList.remove("open");
  }

  const open=e.target.closest("[data-open-auth]");
  if(open) showAuth(open.dataset.openAuth);

  if(e.target.closest("[data-close-auth]")) closeAuth();

  const sw=e.target.closest("[data-switch-auth]");
  if(sw) showAuth(sw.dataset.switchAuth);

  if(e.target.closest("[data-demo-login]")) login();

  if(e.target.closest("[data-login]")){
    const id=$("#loginIdentity").value.trim();

    if(!id){
      toast("Enter your email or username");
      return;
    }

    login({
      name:id.includes("@")?"VYVO User":id,
      username:id.replace("@","")
    });
  }

  if(e.target.closest("[data-signup]")){
    const name=$("#signupName").value.trim();
    const u=$("#signupUsername").value.trim();
    const em=$("#signupEmail").value.trim();
    const p=$("#signupPassword").value;
    const c=$("#signupConfirm").value;

    if(!name||!u||!em||p.length<6||p!==c){
      toast("Please complete the form correctly");
      return;
    }

    login({name,username:u});
  }

  if(e.target.closest("[data-logout]")) logout();

  if(e.target.closest("[data-enter-demo]")) login();

  if(e.target.closest("[data-forgot]")){
    toast("Demo mode: password recovery will be connected to the backend later.");
  }

  if(e.target.closest("[data-close-modal]")) closeModal();
});

$("#modal").addEventListener("click",e=>{
  if(e.target.id==="modal") closeModal();
});

$("#mobileMenu").addEventListener("click",()=>{
  $("#sidebar").classList.toggle("open");
});

$("#globalSearch").addEventListener("keydown",e=>{
  if(e.key==="Enter"&&e.target.value.trim()){
    render("explore");
    toast(`Searching for “${e.target.value.trim()}”`);
  }
});

$("#signupPassword").addEventListener("input",e=>{
  $("#passwordMeter").style.width=Math.min(100,e.target.value.length*14)+"%";
});

if(state.user) login(state.user);

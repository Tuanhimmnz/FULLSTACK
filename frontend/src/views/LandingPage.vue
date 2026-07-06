<template>
  <div class="landing" :class="{ 'light-theme': isLightMode }">
    <!-- PARTICLES BACKGROUND -->
    <canvas ref="particleCanvas" class="particle-canvas"></canvas>

    <!-- NAV -->
    <nav class="nav" :class="{ scrolled: isScrolled }">
      <div class="nav-inner">
        <div class="nav-logo">
          <div class="logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="2" fill="white" opacity="0.9"/>
              <rect x="13" y="3" width="8" height="8" rx="2" fill="white" opacity="0.6"/>
              <rect x="3" y="13" width="8" height="8" rx="2" fill="white" opacity="0.6"/>
              <rect x="13" y="13" width="8" height="8" rx="2" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <span class="logo-text">SprintFlow</span>
        </div>
        <div class="nav-links">
          <a href="#features" class="nav-link">{{ tNav.features }}</a>
          <a href="#how" class="nav-link">{{ tNav.how }}</a>
          <a href="#stats" class="nav-link">{{ tNav.stats }}</a>
          
          <div class="nav-lang-dropdown" @click="langMenuOpen = !langMenuOpen" @blur="langMenuOpen = false" tabindex="0">
            <span class="current-lang">
              {{ currentLang === 'vi' ? '🇻🇳 VN' : '🇺🇸 EN' }}
            </span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
            <transition name="fade">
              <div class="lang-menu" v-show="langMenuOpen">
                <div class="lang-item" :class="{active: currentLang === 'vi'}" @click.stop="setLang('vi')">🇻🇳 Tiếng Việt</div>
                <div class="lang-item" :class="{active: currentLang === 'en'}" @click.stop="setLang('en')">🇺🇸 English</div>
              </div>
            </transition>
          </div>

          
          <div class="theme-toggle" @click="toggleTheme" style="cursor:pointer; display:flex; align-items:center; justify-content:center; width:36px; height:36px; border-radius:50%; background:rgba(255,255,255,0.1); margin-right:10px;">
            <svg v-if="!isLightMode" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
          </div>
          <router-link to="/login" class="btn-nav-login">{{ tNav.login }}</router-link>

          <router-link to="/register" class="btn-nav-register">
            {{ tNav.register }}
            <span class="btn-shimmer"></span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-orb orb-1"></div>
        <div class="hero-orb orb-2"></div>
        <div class="hero-orb orb-3"></div>
        <div class="hero-grid"></div>
      </div>
      <div class="hero-content reveal-left">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          {{ currentLang === 'vi' ? 'Quản lý dự án thông minh · Microservices Architecture' : 'Smart Project Management · Microservices Architecture' }}
        </div>
        <h1 class="hero-title" v-if="currentLang === 'vi'">
          Quản lý dự án<br/>
          <span class="hero-gradient typing-text">{{ typedText }}<span class="cursor">|</span></span><br/>
          cùng SprintFlow
        </h1>
        <h1 class="hero-title" v-else>
          Project Management<br/>
          <span class="hero-gradient typing-text">{{ typedText }}<span class="cursor">|</span></span><br/>
          with SprintFlow
        </h1>
        <p class="hero-desc">
          {{ currentLang === 'vi' ? 'Nền tảng quản lý công việc toàn diện — từ lên kế hoạch sprint, phân công task, theo dõi tiến độ đến thông báo thời gian thực. Tất cả trong một giao diện đẹp mắt.' : 'A comprehensive project management platform — from sprint planning, task assignment, progress tracking to real-time notifications. All in a beautiful interface.' }}
        </p>
        <div class="hero-actions">
          <router-link to="/register" class="btn-primary magnetic">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            {{ tNav.register }}
            <span class="btn-shimmer"></span>
          </router-link>
          <router-link to="/login" class="btn-ghost">
            Đã có tài khoản →
          </router-link>
        </div>
        <div class="hero-stats-new reveal-up" style="--delay: 0.3s">
          <div class="stat-pill">
            <div class="stat-icon" style="color: #6366f1"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg></div>
            <div>
              <div class="stat-val">{{ counters.services }}</div>
              <div class="stat-desc">Microservices</div>
            </div>
          </div>
          <div class="stat-pill">
            <div class="stat-icon" style="color: #ec4899"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div>
            <div>
              <div class="stat-val">JWT</div>
              <div class="stat-desc">Bảo mật</div>
            </div>
          </div>
          <div class="stat-pill">
            <div class="stat-icon" style="color: #10b981"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg></div>
            <div>
              <div class="stat-val">{{ counters.tasks }}+</div>
              <div class="stat-desc">Tính năng</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Dashboard preview -->
      <div class="hero-preview reveal-right">
        <div class="preview-card">
          <div class="preview-header">
            <div class="preview-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <span class="preview-title-bar">SprintFlow — Dashboard</span>
          </div>
          <div class="preview-body">
            <div class="preview-sidebar">
              <div class="ps-item active">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                Dashboard
              </div>
              <div class="ps-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>
                Dự án
              </div>
              <div class="ps-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Kanban
              </div>
              <div class="ps-item notify-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>
                Thông báo
                <span class="badge-count">3</span>
              </div>
            </div>
            <div class="preview-main">
              <div class="pm-title">Tổng quan</div>
              <div class="pm-cards">
                <div class="pm-card blue">
                  <div class="pm-card-num">12</div>
                  <div class="pm-card-label">Dự án</div>
                </div>
                <div class="pm-card purple">
                  <div class="pm-card-num">48</div>
                  <div class="pm-card-label">Task</div>
                </div>
                <div class="pm-card green">
                  <div class="pm-card-num">85%</div>
                  <div class="pm-card-label">Hoàn thành</div>
                </div>
              </div>
              <div class="pm-tasks">
                <div class="pm-task-row">
                  <span class="task-dot done"></span>
                  <span class="task-text">Thiết kế UI Dashboard</span>
                  <span class="task-badge done-badge">Xong</span>
                </div>
                <div class="pm-task-row">
                  <span class="task-dot progress"></span>
                  <span class="task-text">API Gateway integration</span>
                  <span class="task-badge prog-badge">Đang làm</span>
                </div>
                <div class="pm-task-row">
                  <span class="task-dot todo"></span>
                  <span class="task-text">Viết unit tests</span>
                  <span class="task-badge todo-badge">Chờ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="float-card float-1">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/></svg>
          <div>
            <div class="fc-title">Thông báo mới</div>
            <div class="fc-sub">Minh đã comment vào task của bạn</div>
          </div>
        </div>
        <div class="float-card float-2">
          <div class="fc-progress-label">Sprint progress</div>
          <div class="fc-progress-bar">
            <div class="fc-progress-fill"></div>
          </div>
          <div class="fc-progress-pct">72%</div>
        </div>
      </div>
    </section>

    <!-- MARQUEE STRIP -->
    <div class="marquee-wrap">
      <div class="marquee-track">
        <span v-for="tag in [...marquee, ...marquee]" :key="Math.random()" class="marquee-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#6366f1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- FEATURES -->
    <section id="features" class="features features-stack">
      <div class="section-badge reveal-up">{{ tNav.features }}</div>
      <h2 class="section-title reveal-up" style="--delay: 0.1s" v-if="currentLang === 'vi'">Mọi thứ bạn cần để<br/><span class="text-gradient">quản lý dự án hiệu quả</span></h2>
      <h2 class="section-title reveal-up" style="--delay: 0.1s" v-else>Everything you need for<br/><span class="text-gradient">efficient project management</span></h2>
      <p class="section-sub reveal-up" style="--delay: 0.2s">{{ currentLang === 'vi' ? 'Trải nghiệm mượt mà với các tính năng được xếp chồng thông minh.' : 'Seamless experience with smart stacked features.' }}</p>

      <div class="stack-container">
        <div v-for="(feat, i) in features" :key="i" class="stack-card" :style="{ top: `calc(15vh + ${i * 40}px)` }" :data-index="i">
          <div class="card-inner" :style="{ background: feat.bg, boxShadow: `0 -10px 40px ${feat.glow}` }">
          <div class="card-content">
            <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px; width: 100%;">
              <div style="width: 56px; height: 56px; background: rgba(0,0,0,0.3); border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.05);" v-html="feat.icon"></div>
              <div style="text-align: left;">
                <h3 style="margin: 0; font-size: 1.6rem; color: #fff; font-weight: 600;">{{ feat.title }}</h3>
                <div style="color: rgba(255,255,255,0.5); font-size: 0.9rem; margin-top: 4px;">{{ feat.items.length }} tính năng chính</div>
              </div>
            </div>
            <p style="text-align: left; color: #a1a1aa; line-height: 1.6; margin-bottom: 24px; width: 100%; font-size: 1rem;">{{ feat.desc }}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; width: 100%;">
              <div v-for="(item, idx) in (feat.items as any[])" :key="idx" style="background: #18181b; border-radius: 12px; padding: 16px; display: flex; align-items: center; justify-content: flex-start; text-align: left; border: 1px solid rgba(255,255,255,0.05); transition: background 0.2s;">
                <div style="font-weight: 600; font-size: 0.95rem; color: #f4f4f5; line-height: 1.4;">{{ item.text || item }}</div>
              </div>
            </div>
          </div>
            <div class="card-image-wrap">
              <div class="feat-preview-html" v-html="feat.mockupHtml" style="width:100%; height:100%; display:flex; align-items:center; justify-content:center;"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    
    <!-- HOW IT WORKS - SCROLL ANIMATION -->
    <section id="how" class="how-scroll-wrapper">
      <div class="how-sticky-container">
        <div class="how-sticky-title">
          <div class="section-badge light">Hướng dẫn</div>
          <h2 class="section-title white" v-if="currentLang === 'vi'">Bắt đầu chỉ trong<br/><span class="text-gradient-light">3 bước đơn giản</span></h2>
          <h2 class="section-title white" v-else>Get started in<br/><span class="text-gradient-light">3 simple steps</span></h2>
        </div>
        
        <div class="how-split">
          <div class="how-left">
            <div class="how-step-card" v-for="(step, i) in steps" :key="i">
              <div class="step-v-icon-wrap">
                <div class="step-v-num">{{ i + 1 }}</div>
                <div class="step-v-icon" :style="{ background: step.bg, boxShadow: `0 0 30px ${(step as any).glow || 'rgba(99,102,241,0.3)'}` }">
                  <span v-html="step.icon"></span>
                </div>
              </div>
              <div class="step-v-content">
                <h3 class="step-v-title">{{ step.title }}</h3>
                <p class="step-v-desc">{{ step.desc }}</p>
              </div>
            </div>
          </div>
          
          <div class="how-right">
            
            <!-- Step 1 Graphic -->
            <div class="how-graphic-item hg-1">
              <div class="mockup-window glass-panel">
                <div class="mockup-header">
                  <div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div>
                  <div class="mockup-title">Register.vue</div>
                </div>
                <div class="mockup-body align-center">
                  <div style="width: 40px; height: 40px; background: #6366f1; border-radius: 8px; margin-bottom: 10px; display:flex; align-items:center; justify-content:center"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>
                  <h3 style="color: white; margin-bottom: 15px; font-size: 1.2rem;">Create Account</h3>
                  <div class="fake-input" style="justify-content: flex-start"><svg width="16" height="16" style="margin-right:8px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg> Email address</div>
                  <div class="fake-input" style="justify-content: flex-start"><svg width="16" height="16" style="margin-right:8px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0110 0v4"></path></svg> Password</div>
                  <div class="fake-btn" style="background: #6366f1; margin-top: 5px;">Sign Up</div>
                  <div style="font-size: 12px; color: rgba(255,255,255,0.4); margin-top: 10px;">Or continue with Google</div>
                </div>
              </div>
            </div>

            <!-- Step 2 Graphic -->
            <div class="how-graphic-item hg-2">
               <div class="mockup-window glass-panel" style="border-color: rgba(245,158,11,0.3);">
                <div class="mockup-header">
                  <div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div>
                  <div class="mockup-title">ProjectBoard.vue</div>
                </div>
                <div class="mockup-body" style="padding: 20px;">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 10px;">
                     <span style="color:white; font-weight:bold;">Active Projects</span>
                     <span style="padding: 4px 10px; background:#f59e0b; color:white; border-radius:4px; font-size:12px;">+ New</span>
                  </div>
                  <div class="fake-project-card" style="padding: 15px;">
                    <div style="display:flex; justify-content:space-between;">
                        <div class="fpc-title">Website Redesign</div>
                        <div style="font-size:10px; padding: 2px 6px; background: rgba(16,185,129,0.2); color: #10b981; border-radius:4px">Active</div>
                    </div>
                    <div style="width:100%; height:4px; background:rgba(255,255,255,0.1); border-radius:2px; margin-top:5px;"><div style="width: 75%; height:100%; background:#f59e0b; border-radius:2px;"></div></div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top: 10px;">
                        <div style="font-size: 11px; color: rgba(255,255,255,0.5);">Due in 2 days</div>
                        <div class="fpc-avatars">
                          <div class="fpc-avatar" style="background:#ef4444; border: 2px solid #1e293b"></div>
                          <div class="fpc-avatar" style="background:#10b981; border: 2px solid #1e293b; margin-left:-10px;"></div>
                        </div>
                    </div>
                  </div>
                  <div class="fake-project-card" style="padding: 15px; opacity: 0.7;">
                    <div style="display:flex; justify-content:space-between;">
                        <div class="fpc-title">Mobile App v2</div>
                        <div style="font-size:10px; padding: 2px 6px; background: rgba(245,158,11,0.2); color: #f59e0b; border-radius:4px">Planning</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3 Graphic -->
            <div class="how-graphic-item hg-3">
               <div class="mockup-window glass-panel" style="border-color: rgba(16,185,129,0.3);">
                <div class="mockup-header">
                  <div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div>
                  <div class="mockup-title">Kanban.vue</div>
                </div>
                <div class="mockup-body row-layout" style="padding: 20px;">
                  <div class="kanban-col">
                     <div class="k-title">TODO <span style="background:rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 10px; margin-left:5px">2</span></div>
                     <div class="k-card" style="padding: 10px; height: auto;">
                        <div style="width: 30px; height: 4px; background: #ef4444; border-radius: 2px; margin-bottom: 8px;"></div>
                        <div style="width: 80%; height: 8px; background: rgba(255,255,255,0.3); border-radius: 4px; margin-bottom: 5px;"></div>
                        <div style="width: 50%; height: 8px; background: rgba(255,255,255,0.1); border-radius: 4px;"></div>
                     </div>
                     <div class="k-card" style="padding: 10px; height: auto;">
                        <div style="width: 30px; height: 4px; background: #3b82f6; border-radius: 2px; margin-bottom: 8px;"></div>
                        <div style="width: 90%; height: 8px; background: rgba(255,255,255,0.3); border-radius: 4px;"></div>
                     </div>
                  </div>
                  <div class="kanban-col">
                     <div class="k-title">DOING <span style="background:rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 10px; margin-left:5px">1</span></div>
                     <div class="k-card" style="border-left: 3px solid #10b981; padding: 10px; height: auto;">
                        <div style="width: 30px; height: 4px; background: #f59e0b; border-radius: 2px; margin-bottom: 8px;"></div>
                        <div style="width: 70%; height: 8px; background: rgba(255,255,255,0.5); border-radius: 4px; margin-bottom: 5px;"></div>
                        <div style="width: 40%; height: 8px; background: rgba(255,255,255,0.2); border-radius: 4px; margin-bottom: 10px;"></div>
                        <div style="display:flex; justify-content: flex-end;">
                           <div style="width: 16px; height: 16px; border-radius: 50%; background: #10b981;"></div>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </div>
</div>
        </div>
      </div>
    </section>


    <!-- STATS/SERVICES -->
    <section id="stats" class="stats-section">
      <div class="stats-bg">
        <div class="stats-orb"></div>
      </div>
      <div class="horizontal-scroll-section">
        <div class="sticky-wrapper">
          
          <div class="ms-header">
            <div class="section-badge light">Kiến trúc hệ thống</div>
            <h2 class="section-title white" style="margin-bottom: 0;">Xây dựng trên nền tảng<br/><span class="text-gradient-light">Microservices hiện đại</span></h2>
          </div>
          
          <div class="horizontal-track">
            <div v-for="(svc, i) in services" :key="svc.name" class="horizontal-panel" :style="{ '--theme-color': svc.color }">
              <div class="svc-pane-content">
                <div class="svc-pane-text">
                  <div class="svc-pane-icon" v-html="svc.icon"></div>
                  <div class="svc-title-row">
                    <h3 class="svc-pane-title">{{ svc.name }}</h3>
                    <div class="svc-port-badge">Port {{ svc.port }}</div>
                  </div>
                  <ul class="svc-pane-features">
                    <li v-for="feat in svc.features" :key="feat">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                      {{ feat }}
                    </li>
                  </ul>
                </div>
                
                <div class="svc-pane-visual">
                  <div class="svc-mockup-area">
                    
                    <!-- Tab 0: API Gateway -->
                    <div v-if="i === 0" class="ms-mockup-api">
                      <div class="ms-client-box">Client App</div>
                      <div class="ms-api-beams">
                        <div class="ms-beam"></div>
                        <div class="ms-beam delay-1"></div>
                        <div class="ms-beam delay-2"></div>
                      </div>
                      <div class="ms-gateway-box">
                        <div class="ms-shield-icon">🛡️</div>
                        <span>Ocelot API Gateway</span>
                        <div class="ms-jwt-badge">JWT Verified</div>
                      </div>
                      <div class="ms-microservices-grid">
                        <div class="ms-micro-box" style="--c: #6366f1">Project</div>
                        <div class="ms-micro-box" style="--c: #ef4444">Task</div>
                        <div class="ms-micro-box" style="--c: #10b981">Notify</div>
                      </div>
                    </div>
                    
                    <!-- Tab 1: Project Service -->
                    <div v-if="i === 1" class="ms-mockup-project">
                      <div class="ms-window">
                        <div class="ms-win-header">
                          <div class="ms-win-dots"><span/><span/><span/></div>
                          <div class="ms-win-title">Projects Dashboard</div>
                        </div>
                        <div class="ms-win-body">
                          <div class="ms-proj-card">
                            <div class="ms-proj-top">
                              <div class="ms-proj-icon" style="background:#6366f1">W</div>
                              <div class="ms-proj-name">Website Redesign</div>
                              <div class="ms-proj-badge">Active</div>
                            </div>
                            <div class="ms-proj-bar"><div class="ms-proj-fill" style="width: 80%; background:#6366f1"></div></div>
                          </div>
                          <div class="ms-proj-card delay-1">
                            <div class="ms-proj-top">
                              <div class="ms-proj-icon" style="background:#ec4899">M</div>
                              <div class="ms-proj-name">Mobile App v2.0</div>
                              <div class="ms-proj-badge" style="color:#ec4899; background:rgba(236,72,153,0.1)">Planning</div>
                            </div>
                            <div class="ms-proj-bar"><div class="ms-proj-fill" style="width: 30%; background:#ec4899"></div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Tab 2: Task Service -->
                    <div v-if="i === 2" class="ms-mockup-task">
                      <div class="ms-kanban">
                        <div class="ms-kb-col">
                          <div class="ms-kb-title">TODO <span>2</span></div>
                          <div class="ms-kb-card kb-anim-1"></div>
                          <div class="ms-kb-card kb-anim-2"></div>
                        </div>
                        <div class="ms-kb-col">
                          <div class="ms-kb-title">DOING <span>1</span></div>
                          <div class="ms-kb-card kb-anim-drag"></div>
                        </div>
                        <div class="ms-kb-col">
                          <div class="ms-kb-title">DONE <span>3</span></div>
                          <div class="ms-kb-card done"></div>
                          <div class="ms-kb-card done"></div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Tab 3: Notify Service -->
                    <div v-if="i === 3" class="ms-mockup-notify">
                      <div class="ms-bell-container">
                        <div class="ms-bell-ring"></div>
                        <div class="ms-bell-ring delay-1"></div>
                        <svg class="ms-bell-icon" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
                        <div class="ms-bell-badge">3</div>
                      </div>
                      <div class="ms-toast-popup">
                        <div class="ms-toast-icon">✓</div>
                        <div class="ms-toast-text">
                          <strong>Trường Đỗ</strong> đã giao việc cho bạn.
                          <span>Vài giây trước</span>
                        </div>
                      </div>
                    </div>
                    
                  </div>
                </div>
                
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="testimonials-section py-24 relative overflow-hidden" style="border-top: 1px solid rgba(255,255,255,0.05);">
      <div class="text-center max-w-3xl mx-auto mb-16 px-6">
        <h2 class="text-4xl font-black mb-4 title-text">Loved by Teams Worldwide</h2>
        <p class="text-lg sub-text">Thousands of forward-thinking teams use SprintFlow.</p>
      </div>
      <div class="marquee-container" style="display:flex; gap:24px; overflow:hidden; width:100%;">
        <div class="marquee-content" style="display:flex; gap:24px; animation: marquee 30s linear infinite;">
          <div class="testimonial-card" style="min-width:350px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:20px; padding:24px;">
            <div class="flex items-center gap-3 mb-4">
              <img src="https://i.pravatar.cc/150?u=1" class="w-10 h-10 rounded-full" />
              <div><div class="font-bold title-text">Sarah Jenkins</div><div class="text-xs sub-text">Product Manager @ Acme</div></div>
            </div>
            <p class="text-sm title-text opacity-80 leading-relaxed">"SprintFlow completely transformed how we ship features. The real-time chat integrated right into tasks is a game changer."</p>
          </div>
          <div class="testimonial-card" style="min-width:350px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:20px; padding:24px;">
            <div class="flex items-center gap-3 mb-4">
              <img src="https://i.pravatar.cc/150?u=2" class="w-10 h-10 rounded-full" />
              <div><div class="font-bold title-text">David Chen</div><div class="text-xs sub-text">CTO @ StartupX</div></div>
            </div>
            <p class="text-sm title-text opacity-80 leading-relaxed">"The role-based access control and JWT security give us peace of mind when working with enterprise clients."</p>
          </div>
          <div class="testimonial-card" style="min-width:350px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:20px; padding:24px;">
            <div class="flex items-center gap-3 mb-4">
              <img src="https://i.pravatar.cc/150?u=3" class="w-10 h-10 rounded-full" />
              <div><div class="font-bold title-text">Emily Rodriguez</div><div class="text-xs sub-text">Lead Designer</div></div>
            </div>
            <p class="text-sm title-text opacity-80 leading-relaxed">"Absolutely gorgeous UI. Working in SprintFlow doesn't feel like a chore; it feels like stepping into the future."</p>
          </div>
          <!-- Repeat for smooth scroll -->
          <div class="testimonial-card" style="min-width:350px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:20px; padding:24px;">
            <div class="flex items-center gap-3 mb-4">
              <img src="https://i.pravatar.cc/150?u=1" class="w-10 h-10 rounded-full" />
              <div><div class="font-bold title-text">Sarah Jenkins</div><div class="text-xs sub-text">Product Manager @ Acme</div></div>
            </div>
            <p class="text-sm title-text opacity-80 leading-relaxed">"SprintFlow completely transformed how we ship features. The real-time chat integrated right into tasks is a game changer."</p>
          </div>
          <div class="testimonial-card" style="min-width:350px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:20px; padding:24px;">
            <div class="flex items-center gap-3 mb-4">
              <img src="https://i.pravatar.cc/150?u=2" class="w-10 h-10 rounded-full" />
              <div><div class="font-bold title-text">David Chen</div><div class="text-xs sub-text">CTO @ StartupX</div></div>
            </div>
            <p class="text-sm title-text opacity-80 leading-relaxed">"The role-based access control and JWT security give us peace of mind when working with enterprise clients."</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PRICING -->
    <section class="pricing-section py-24" style="background:rgba(255,255,255,0.01); border-top: 1px solid rgba(255,255,255,0.05);">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-3xl mx-auto mb-20">
          <h2 class="text-4xl md:text-5xl font-black mb-6 title-text">Simple, transparent pricing</h2>
          <p class="text-lg sub-text">Start for free, upgrade when your team grows.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div class="p-card" style="background:var(--card-inner-bg, #0c0c0c); border:1px solid rgba(255,255,255,0.1); border-radius:24px; padding:40px;">
            <h3 class="text-xl font-bold mb-2 title-text">Hobby</h3>
            <p class="text-sm sub-text mb-6">For individuals & small teams</p>
            <div class="text-4xl font-black mb-6 title-text">Free<span class="text-lg font-normal sub-text">/forever</span></div>
            <ul class="flex flex-col gap-3 mb-8 title-text text-sm">
              <li class="flex items-center gap-2"><svg width="16" height="16" stroke="#10b981" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg> Up to 3 projects</li>
              <li class="flex items-center gap-2"><svg width="16" height="16" stroke="#10b981" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg> Basic Kanban board</li>
            </ul>
            <a href="#" class="btn-outline" style="display:block; text-align:center; padding:12px; border-radius:8px; border:1px solid rgba(255,255,255,0.1);">Get Started</a>
          </div>
          <div class="p-card p-pro" style="background:var(--card-inner-bg, #0c0c0c); border:1px solid #8b5cf6; box-shadow:0 10px 40px rgba(139,92,246,0.15); border-radius:24px; padding:40px; position:relative; transform:translateY(-16px);">
            <div style="position:absolute; top:-12px; left:50%; transform:translateX(-50%); background:linear-gradient(90deg,#6366f1,#8b5cf6); color:white; font-size:10px; font-weight:bold; padding:4px 12px; border-radius:12px;">RECOMMENDED</div>
            <h3 class="text-xl font-bold mb-2 title-text">Pro Team</h3>
            <p class="text-sm sub-text mb-6">For professional teams</p>
            <div class="text-4xl font-black mb-6 title-text">$12<span class="text-lg font-normal sub-text">/user/mo</span></div>
            <ul class="flex flex-col gap-3 mb-8 title-text text-sm">
              <li class="flex items-center gap-2"><svg width="16" height="16" stroke="#10b981" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg> Unlimited projects</li>
              <li class="flex items-center gap-2"><svg width="16" height="16" stroke="#10b981" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg> Real-time Chat</li>
              <li class="flex items-center gap-2"><svg width="16" height="16" stroke="#10b981" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg> Role-based access</li>
            </ul>
            <a href="#" class="btn-primary" style="display:block; text-align:center; padding:12px; border-radius:8px; background:linear-gradient(90deg,#6366f1,#8b5cf6); color:white;">Try for 14 days</a>
          </div>
          <div class="p-card" style="background:var(--card-inner-bg, #0c0c0c); border:1px solid rgba(255,255,255,0.1); border-radius:24px; padding:40px;">
            <h3 class="text-xl font-bold mb-2 title-text">Enterprise</h3>
            <p class="text-sm sub-text mb-6">For large organizations</p>
            <div class="text-4xl font-black mb-6 title-text">Custom</div>
            <ul class="flex flex-col gap-3 mb-8 title-text text-sm">
              <li class="flex items-center gap-2"><svg width="16" height="16" stroke="#10b981" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg> All Pro features</li>
              <li class="flex items-center gap-2"><svg width="16" height="16" stroke="#10b981" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg> SSO Integration</li>
              <li class="flex items-center gap-2"><svg width="16" height="16" stroke="#10b981" stroke-width="2" fill="none"><polyline points="20 6 9 17 4 12"/></svg> 24/7 Support</li>
            </ul>
            <a href="#" class="btn-outline" style="display:block; text-align:center; padding:12px; border-radius:8px; border:1px solid rgba(255,255,255,0.1);">Contact Sales</a>
          </div>
        </div>
      </div>
    </section>

    

    <!-- FOOTER -->
    <footer class="footer">
      <div class="footer-inner">
        <div class="footer-logo reveal-up">
          <div class="logo-icon small">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="8" height="8" rx="2" fill="white" opacity="0.9"/>
              <rect x="13" y="3" width="8" height="8" rx="2" fill="white" opacity="0.5"/>
              <rect x="3" y="13" width="8" height="8" rx="2" fill="white" opacity="0.5"/>
              <rect x="13" y="13" width="8" height="8" rx="2" fill="white" opacity="0.9"/>
            </svg>
          </div>
          <span>SprintFlow</span>
        </div>
        <div class="footer-links reveal-up" style="--delay: 0.1s">
          <router-link to="/login">Đăng nhập</router-link>
          <router-link to="/register">Đăng ký</router-link>
        </div>
        <div class="footer-copy reveal-up" style="--delay: 0.2s">© 2026 SprintFlow · Hệ thống quản lý dự án</div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Lenis from 'lenis'
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'


let lenis: any;
let rafId: number;
const currentLang = ref('vi');
const langMenuOpen = ref(false);

const activeFeature = ref(0);

const setLang = (lang: string) => {
  currentLang.value = lang;
  langMenuOpen.value = false;
};

const tNav = computed(() => currentLang.value === 'vi' ? {
  features: 'Tính năng', how: 'Cách hoạt động', stats: 'Kiến trúc',
  login: 'Đăng nhập', register: 'Bắt đầu miễn phí'
} : {
  features: 'Features', how: 'How it works', stats: 'Architecture',
  login: 'Login', register: 'Get Started'
});

// ── TYPING EFFECT ──
const wordsVi = ['hiệu quả hơn', 'chuyên nghiệp hơn', 'thông minh hơn', 'dễ dàng hơn']
const wordsEn = ['more efficiently', 'more professionally', 'smarter', 'easier']
const words = computed(() => currentLang.value === 'vi' ? wordsVi : wordsEn)

let wordIdx = 0, charIdx = 0, deleting = false
const typedText = ref('')

watch(currentLang, () => {
  wordIdx = 0; charIdx = 0; deleting = false; typedText.value = '';
});

function typeLoop() {
  const word = words.value[wordIdx]
  if (!word) return;
  if (!deleting) {
    typedText.value = word.slice(0, ++charIdx)
    if (charIdx === word.length) {
      deleting = true
      setTimeout(typeLoop, 1800)
      return
    }
  } else {
    typedText.value = word.slice(0, --charIdx)
    if (charIdx === 0) {
      deleting = false
      wordIdx = (wordIdx + 1) % words.value.length
    }
  }
  setTimeout(typeLoop, deleting ? 60 : 90)
}

// ── COUNTER ANIMATION ──
const counters = ref({ services: 0, tasks: 0 })
function animateCounter(key: 'services' | 'tasks', target: number, duration = 1500) {
  const start = performance.now()
  function step(now: number) {
    const progress = Math.min((now - start) / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3)
    counters.value[key] = Math.round(ease * target)
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

// ── PARTICLES ──
const particleCanvas = ref<HTMLCanvasElement | null>(null)
let animFrame = 0
function initParticles() {
  if (!particleCanvas.value) return
  const canvas: HTMLCanvasElement = particleCanvas.value
  const ctx = canvas.getContext('2d')!
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const particles: { x: number; y: number; vx: number; vy: number; r: number; alpha: number }[] = []
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.4 + 0.1
    })
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(99,102,241,${p.alpha})`
      ctx.fill()
    })
    // Draw connecting lines
    particles.forEach((a, i) => {
      particles.slice(i + 1).forEach(b => {
        const d = Math.hypot(a.x - b.x, a.y - b.y)
        if (d < 120) {
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(99,102,241,${0.06 * (1 - d / 120)})`
          ctx.stroke()
        }
      })
    })
    animFrame = requestAnimationFrame(draw)
  }
  draw()
}

// ── SCROLL REVEAL ──
let observer: IntersectionObserver
function initScrollReveal() {
  observer = new IntersectionObserver((entries) => {
    entries.forEach(el => {
      if (el.isIntersecting) {
        const target = el.target as HTMLElement
        const delay = target.style.getPropertyValue('--delay') || '0s'
        target.style.transitionDelay = delay
        target.classList.add('revealed')
        observer.unobserve(el.target)
      }
    })
  }, { threshold: 0, rootMargin: '50px' })
  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-slide-right').forEach(el => observer.observe(el))
}

// ── SCROLL NAV ──

const isLightMode = ref(false)
const toggleTheme = () => {
  isLightMode.value = !isLightMode.value
}

const isScrolled = ref(false)
function onScroll() { 
  isScrolled.value = window.scrollY > 50

  // 1. Apple-style Horizontal Scroll Logic
  const hSection = document.querySelector('.horizontal-scroll-section')
  const hTrack = document.querySelector('.horizontal-track') as HTMLElement
  if (hSection && hTrack) {
    const rect = hSection.getBoundingClientRect()
    const height = rect.height - window.innerHeight
    let progress = 0
    if (rect.top <= 0) {
      progress = -rect.top / height
    }
    progress = Math.max(0, Math.min(1, progress))
    // Track width minus viewport width gives max translation
    const maxTranslate = hTrack.scrollWidth - window.innerWidth
    hTrack.style.transform = `translateX(-${progress * maxTranslate}px)`
  

    // Animate each panel based on distance from center
    const panels = document.querySelectorAll('.horizontal-panel')
    panels.forEach(panel => {
      const rect = panel.getBoundingClientRect()
      const panelCenter = rect.left + rect.width / 2
      const viewportCenter = window.innerWidth / 2
      
      const distFromCenter = panelCenter - viewportCenter
      // Max distance is roughly the width of the screen
      const maxDist = window.innerWidth * 0.8
      let ratio = Math.abs(distFromCenter) / maxDist
      ratio = Math.max(0, Math.min(1, ratio))
      
      // As it moves away from center, shrink to 0.7, fade to 0.1, blur to 10px
      const scale = 1 - (ratio * 0.3)
      const opacity = 1 - (ratio * 0.9)
      const blur = ratio * 10
      
      // If distFromCenter < 0, it means it's the PREVIOUS card moving Left.
      // We can make it also translate slightly left-down to look like it's dropping away
      let translateY = ratio * 50 // moves down 50px
      let rotateY = (distFromCenter / maxDist) * 15 // rotate slightly
      
      const paneContent = panel.querySelector('.svc-pane-content') as HTMLElement
      if (paneContent) {
        paneContent.style.transform = `scale(${scale}) translateY(${translateY}px) rotateY(${rotateY}deg)`
        paneContent.style.opacity = opacity.toString()
        paneContent.style.filter = `blur(${blur}px)`
      }
    })
}

  // 2. Stacking Cards Logic
  const stackCards = document.querySelectorAll('.stack-card')
  const stackContainer = document.querySelector('.features-stack')
  
  if (stackCards.length > 0 && stackContainer) {
    stackCards.forEach((card, index) => {
      // Each card is sticky at (15vh + index * 40px)
      const stickyTop = (window.innerHeight * 0.15) + (index * 40)
      
      let distance = 0;
      if (index < stackCards.length - 1) {
        const nextCard = stackCards[index + 1]
        const nextRect = nextCard.getBoundingClientRect()
        const nextStickyTop = (window.innerHeight * 0.15) + ((index + 1) * 40)
        
        // maxOverlap is roughly the height of the card (65vh)
        const maxOverlap = window.innerHeight * 0.65;
        const currentOverlap = maxOverlap - (nextRect.top - nextStickyTop)
        distance = Math.max(0, currentOverlap);
      } else {
         const rect = card.getBoundingClientRect();
         distance = Math.max(0, -rect.top + stickyTop); // ONLY works when pushed by bottom of container
      }
      
      let scale = 1 - (distance * 0.0004);
      scale = Math.max(0.85, scale);
      let rotateX = Math.min(10, distance * 0.015);
      let yOffset = distance * -0.15; // Shift Up significantly
      let translateX = distance * -0.3; // Shift Left significantly to create Top-Left diagonal stack
      
      let opacity = Math.max(0.3, 1 - (distance * 0.0015));
      let blur = Math.min(15, distance * 0.025); // Stronger Blur effect
      
      const inner = card.querySelector('.card-inner') as HTMLElement;
      if (inner) {
        inner.style.transform = `scale(${scale}) perspective(1200px) rotateX(${rotateX}deg) translate(${translateX}px, ${yOffset}px)`;
        inner.style.opacity = opacity.toString();
        inner.style.filter = `blur(${blur}px)`;
        inner.style.transformOrigin = 'top center';
      }
    })
  }




  // 3. How It Works - 3 Step Scroll Logic
  const howWrapper = document.querySelector('.how-scroll-wrapper')
  if (howWrapper && window.innerWidth > 768) {
    const rect = howWrapper.getBoundingClientRect()
    const height = rect.height - window.innerHeight
    let progress = 0
    if (rect.top <= 0) {
      progress = -rect.top / height
    }
    progress = Math.max(0, Math.min(1, progress))
    
    const stepCards = document.querySelectorAll('.how-step-card')
    const graphics = document.querySelectorAll('.how-graphic-item')
    
    stepCards.forEach((card, i) => {
       const target = i * 0.4 // 0, 0.4, 0.8
       const dist = progress - target
       
       let opacity = 1 - Math.min(1, Math.abs(dist) * 3.5)
       let translateY = dist * -150 
       let scale = 1 - Math.min(0.2, Math.abs(dist) * 0.5)
       let blur = Math.min(10, Math.abs(dist) * 20)
       
       const el = card as HTMLElement
       el.style.opacity = opacity.toString()
       el.style.transform = `translateY(${translateY}px) scale(${scale})`
       el.style.filter = `blur(${blur}px)`
    })
    
    graphics.forEach((g, i) => {
       const target = i * 0.4
       const dist = progress - target
       
       let opacity = 1 - Math.min(1, Math.abs(dist) * 4)
       
       let scale = 1;
       let rotateY = 0;
       let rotateX = 0;
       let translateY = 0;
       let translateX = 0;
       
       if (i === 0) {
          // Slide from Right & Zoom
          translateX = dist * -300
          scale = 1 - Math.abs(dist)
       } else if (i === 1) {
          // Flip from bottom
          translateY = dist * -200
          rotateX = dist * -90
       } else {
          // 3D Spin
          rotateY = dist * 180
          scale = 1 + Math.abs(dist)
       }
       
       const el = g as HTMLElement
       el.style.opacity = opacity.toString()
       el.style.transform = `translateY(${translateY}px) translateX(${translateX}px) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    })
  } else if (howWrapper && window.innerWidth <= 768) {
     // Mobile fallback: just show all or show first
     const stepCards = document.querySelectorAll('.how-step-card')
     const graphics = document.querySelectorAll('.how-graphic-item')
     stepCards.forEach(c => c.classList.add('active-mobile'))
     graphics.forEach(g => g.classList.add('active-mobile'))
  }
}
onMounted(() => {

  lenis = new Lenis()
  function raf(time: number) {
    lenis.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)

  typeLoop()
  setTimeout(() => animateCounter('services', 4, 1200), 500)
  setTimeout(() => animateCounter('tasks', 20, 1500), 700)
  initParticles()

  

  setTimeout(initScrollReveal, 100)
  window.addEventListener('scroll', onScroll)
  window.addEventListener('resize', () => {
    if (particleCanvas.value) {
      particleCanvas.value.width = window.innerWidth
      particleCanvas.value.height = window.innerHeight
    }
  })

  // Feature observer for background transitions
  featObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeFeature.value = parseInt(entry.target.getAttribute('data-index') || '0')
      }
    })
  }, { threshold: 0.5 })

  setTimeout(() => {
    document.querySelectorAll('.feat-row').forEach((el, index) => {
      el.setAttribute('data-index', index.toString())
      featObserver?.observe(el)
    })
  }, 500)
})

let featObserver: IntersectionObserver | null = null

onUnmounted(() => {

  if (rafId) cancelAnimationFrame(rafId)
  if (lenis) lenis.destroy()

  cancelAnimationFrame(animFrame)
  observer?.disconnect()
  featObserver?.disconnect()
  window.removeEventListener('scroll', onScroll)
})

// ── DATA ──
const marquee = [
  'Vue 3', 'TypeScript', '.NET 8', 'Ocelot Gateway', 'JWT Auth', 'SQL Server',
  'Microservices', 'Kanban Board', 'Real-time Notify', 'REST API', 'CORS', 'Swagger'
]

const featuresVi = [
  {
    title: 'Quản lý dự án',
    desc: 'Tạo và quản lý nhiều dự án song song với đầy đủ thông tin về tiến độ, thành viên và trạng thái.',
    bg: '#09090b',
    glow: 'rgba(99,102,241,0.5)',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>`,
    items: [{ text: 'Màu sắc và mô tả', icon: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#60a5fa' stroke-width='2'><circle cx='13.5' cy='6.5' r='.5'/><circle cx='17.5' cy='10.5' r='.5'/><circle cx='8.5' cy='7.5' r='.5'/><circle cx='6.5' cy='12.5' r='.5'/><path d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z'/></svg>` }, { text: 'Thành viên dự án', icon: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#8b5cf6' stroke-width='2'><path d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M23 21v-2a4 4 0 00-3-3.87'/><path d='M16 3.13a4 4 0 010 7.75'/></svg>` }, { text: 'Tiến độ realtime', icon: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#10b981' stroke-width='2'><polyline points='22 12 18 12 15 21 9 3 6 12 2 12'/></svg>` }, { text: 'Lọc và tìm kiếm', icon: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#3b82f6' stroke-width='2'><circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/></svg>` }],
    mockupHtml: `

      <div class="mk-hud reveal-up" style="width: 100%; height: 100%; display: flex; background: #0f0f13; border-radius: 0 !important; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); font-family: sans-serif;">
        <!-- Sidebar -->
        <div style="width: 25%; background: #18181b; padding: 20px 15px; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 12px;">
          <div style="width: 80%; height: 16px; background: rgba(255,255,255,0.1); border-radius: 4px; margin-bottom: 16px;"></div>
          <div style="width: 60%; height: 12px; background: rgba(99,102,241,0.2); border-radius: 4px;"></div>
          <div style="width: 70%; height: 12px; background: rgba(255,255,255,0.05); border-radius: 4px;"></div>
          <div style="width: 50%; height: 12px; background: rgba(255,255,255,0.05); border-radius: 4px;"></div>
        </div>
        <!-- Main Content -->
        <div style="width: 75%; padding: 24px; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <div style="font-size: 1.1rem; font-weight: 600; color: #fff;">Projects</div>
            <div style="padding: 6px 12px; background: #6366f1; color: #fff; font-size: 0.75rem; border-radius: 6px; font-weight: 500;">+ New Project</div>
          </div>
          <!-- Table Header -->
          <div style="display: flex; font-size: 0.7rem; color: #71717a; margin-bottom: 12px; text-transform: uppercase; font-weight: 600;">
            <div style="flex: 2;">Name</div>
            <div style="flex: 1;">Status</div>
            <div style="flex: 1.5;">Progress</div>
          </div>
          <!-- Table Row 1 -->
          <div class="float-anim" style="display: flex; align-items: center; padding: 12px 0; border-top: 1px solid rgba(255,255,255,0.05);">
            <div style="flex: 2; display: flex; align-items: center; gap: 8px;">
              <div style="width: 24px; height: 24px; border-radius: 6px; background: #6366f1; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #fff; font-weight: bold;">W</div>
              <div style="font-size: 0.85rem; color: #e4e4e7; font-weight: 500;">Website Redesign</div>
            </div>
            <div style="flex: 1;">
              <span style="background: rgba(16,185,129,0.15); color: #10b981; padding: 2px 8px; border-radius: 12px; font-size: 0.65rem; font-weight: 600;">Active</span>
            </div>
            <div style="flex: 1.5; display: flex; align-items: center; gap: 8px;">
              <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                <div style="width: 75%; height: 100%; background: #6366f1; border-radius: 3px;"></div>
              </div>
              <span style="font-size: 0.7rem; color: #a1a1aa;">75%</span>
            </div>
          </div>
          <!-- Table Row 2 -->
          <div class="float-anim-delayed" style="display: flex; align-items: center; padding: 12px 0; border-top: 1px solid rgba(255,255,255,0.05);">
            <div style="flex: 2; display: flex; align-items: center; gap: 8px;">
              <div style="width: 24px; height: 24px; border-radius: 6px; background: #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #fff; font-weight: bold;">M</div>
              <div style="font-size: 0.85rem; color: #e4e4e7; font-weight: 500;">Mobile App</div>
            </div>
            <div style="flex: 1;">
              <span style="background: rgba(245,158,11,0.15); color: #f59e0b; padding: 2px 8px; border-radius: 12px; font-size: 0.65rem; font-weight: 600;">Paused</span>
            </div>
            <div style="flex: 1.5; display: flex; align-items: center; gap: 8px;">
              <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                <div style="width: 30%; height: 100%; background: #f59e0b; border-radius: 3px;"></div>
              </div>
              <span style="font-size: 0.7rem; color: #a1a1aa;">30%</span>
            </div>
          </div>
        </div>
      </div>

    `
  },
  {
    title: 'Bảng Kanban',
    desc: 'Hệ thống quản lý công việc trực quan theo phong cách Kanban. Nắm bắt tức thì ai đang làm gì, ở đâu.',
    bg: '#09090b',
    glow: 'rgba(139,92,246,0.5)',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7v7m8-7v4"/></svg>`,
    items: ['Kéo thả linh hoạt', 'Tùy chỉnh cột trạng thái', 'Gán thành viên, deadline', 'Đính kèm file & comment'],
    mockupHtml: `

      <div class="mk-hud reveal-up" style="width: 100%; height: 100%; padding: 24px; background: #121214; border-radius: 0 !important; border: 1px solid rgba(255,255,255,0.05); font-family: sans-serif;">
        <div style="font-size: 1rem; font-weight: 600; color: #fff; margin-bottom: 20px; display: flex; justify-content: space-between;">
          <span>Sprint 14 Board</span>
          <div style="display: flex; gap: -5px;">
            <div style="width: 20px; height: 20px; border-radius: 50%; background: #ec4899; border: 2px solid #121214;"></div>
            <div style="width: 20px; height: 20px; border-radius: 50%; background: #3b82f6; border: 2px solid #121214; margin-left: -8px;"></div>
            <div style="width: 20px; height: 20px; border-radius: 50%; background: #6366f1; border: 2px solid #121214; margin-left: -8px;"></div>
          </div>
        </div>
        <div style="display: flex; gap: 16px; height: calc(100% - 45px);">
          <!-- TO DO Column -->
          <div style="flex: 1; display: flex; flex-direction: column; gap: 12px;">
            <div style="font-size: 0.75rem; color: #a1a1aa; font-weight: 600;">TODO (1)</div>
            <div class="float-anim" style="background: #1f1f22; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
              <span style="background: rgba(239,68,68,0.15); color: #ef4444; padding: 2px 6px; border-radius: 4px; font-size: 0.6rem; font-weight: 600;">Bug</span>
              <div style="font-size: 0.8rem; color: #e4e4e7; font-weight: 500; margin: 8px 0;">Fix login API crash</div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717a" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <div style="width: 16px; height: 16px; border-radius: 50%; background: #ef4444;"></div>
              </div>
            </div>
          </div>
          <!-- IN PROGRESS Column -->
          <div style="flex: 1; display: flex; flex-direction: column; gap: 12px;">
            <div style="font-size: 0.75rem; color: #a1a1aa; font-weight: 600;">IN PROGRESS (1)</div>
            <div class="float-anim-delayed" style="background: #1f1f22; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
              <span style="background: rgba(99,102,241,0.15); color: #6366f1; padding: 2px 6px; border-radius: 4px; font-size: 0.6rem; font-weight: 600;">Feature</span>
              <div style="font-size: 0.8rem; color: #e4e4e7; font-weight: 500; margin: 8px 0;">Implement Drag & Drop</div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <div style="display: flex; align-items: center; gap: 4px; font-size: 0.65rem; color: #71717a;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> 2
                </div>
                <div style="width: 16px; height: 16px; border-radius: 50%; background: #3b82f6;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    `
  },
  {
    title: 'Thông báo Realtime',
    desc: 'Mọi thay đổi trong dự án đều được đồng bộ và thông báo ngay lập tức tới tất cả các thành viên liên quan.',
    bg: '#09090b',
    glow: 'rgba(16,185,129,0.5)',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`,
    items: ['Cập nhật trạng thái tức thì', 'Giao tiếp qua chat bong bóng', 'Nhận thông báo khi được gán', 'Lịch sử hoạt động'],
    mockupHtml: `

      <div class="mk-hud reveal-up" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-image: radial-gradient(circle at center, rgba(16,185,129,0.1) 0%, transparent 70%);">
        <!-- Notification Dropdown UI -->
        <div class="pop-in" style="width: 300px; background: rgba(24,24,27,0.8); backdrop-filter: blur(12px); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); font-family: sans-serif; overflow: hidden;">
          <div style="padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 0.9rem; font-weight: 600; color: #fff;">Notifications</div>
            <div style="font-size: 0.7rem; color: #10b981; cursor: pointer;">Mark all as read</div>
          </div>
          <!-- Item 1 (Unread) -->
          <div style="padding: 16px; display: flex; gap: 12px; background: rgba(255,255,255,0.02); border-left: 2px solid #10b981;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #3b82f6; flex-shrink: 0;"></div>
            <div style="flex: 1;">
              <div style="font-size: 0.8rem; color: #e4e4e7; margin-bottom: 4px; line-height: 1.4;">
                <span style="font-weight: 600; color: #fff;">David</span> assigned you to <span style="font-weight: 600;">Update Landing Page</span>
              </div>
              <div style="font-size: 0.65rem; color: #a1a1aa;">2 mins ago</div>
            </div>
            <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-top: 4px;"></div>
          </div>
          <!-- Item 2 (Read) -->
          <div style="padding: 16px; display: flex; gap: 12px; border-top: 1px solid rgba(255,255,255,0.05);">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #ec4899; flex-shrink: 0;"></div>
            <div style="flex: 1;">
              <div style="font-size: 0.8rem; color: #a1a1aa; margin-bottom: 4px; line-height: 1.4;">
                <span style="font-weight: 600; color: #e4e4e7;">Sarah</span> commented on <span style="font-weight: 600;">API Gateway Setup</span>
              </div>
              <div style="font-size: 0.65rem; color: #71717a;">1 hour ago</div>
            </div>
          </div>
        </div>
      </div>

    `
  },
  {
    title: 'Bảo mật & Phân quyền',
    desc: 'Bảo vệ dữ liệu tuyệt đối với hệ thống mã hóa JWT và cơ chế phân quyền RBAC chi tiết.',
    bg: '#09090b',
    glow: 'rgba(236,72,153,0.5)',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`,
    items: [{ text: 'Xác thực JWT', icon: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#60a5fa' stroke-width='2'><path d='M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4'/></svg>` }, { text: 'Role-Based Access', icon: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#8b5cf6' stroke-width='2'><rect x='3' y='11' width='18' height='11' rx='2' ry='2'/><path d='M7 11V7a5 5 0 0110 0v4'/></svg>` }, { text: 'Admin / Member', icon: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#10b981' stroke-width='2'><path d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M23 21v-2a4 4 0 00-3-3.87'/><path d='M16 3.13a4 4 0 010 7.75'/></svg>` }, { text: 'Xác minh 2FA', icon: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#f59e0b' stroke-width='2'><rect x='5' y='2' width='14' height='20' rx='2' ry='2'/><line x1='12' y1='18' x2='12.01' y2='18'/></svg>` }],
    mockupHtml: `

      <div class="mk-hud reveal-up" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-family: sans-serif;">
        <div class="float-anim" style="width: 90%; background: #18181b; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 20px 40px rgba(0,0,0,0.4); padding: 20px;">
          <div style="font-size: 1rem; font-weight: 600; color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            User Roles & Security
          </div>
          <!-- User Row 1 -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 28px; height: 28px; border-radius: 50%; background: #ec4899;"></div>
              <div>
                <div style="font-size: 0.85rem; color: #e4e4e7; font-weight: 500;">alex@company.com</div>
                <div style="font-size: 0.65rem; color: #71717a;">Last active: Just now</div>
              </div>
            </div>
            <div style="display: flex; gap: 12px; align-items: center;">
              <div style="background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; color: #fff; border: 1px solid rgba(255,255,255,0.1);">Admin <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline; margin-left:4px;"><polyline points="6 9 12 15 18 9"/></svg></div>
            </div>
          </div>
          <!-- User Row 2 -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 28px; height: 28px; border-radius: 50%; background: #3b82f6;"></div>
              <div>
                <div style="font-size: 0.85rem; color: #e4e4e7; font-weight: 500;">sarah@company.com</div>
                <div style="font-size: 0.65rem; color: #71717a;">Last active: 2 days ago</div>
              </div>
            </div>
            <div style="display: flex; gap: 12px; align-items: center;">
              <div style="background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; color: #a1a1aa; border: 1px solid rgba(255,255,255,0.1);">Member <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline; margin-left:4px;"><polyline points="6 9 12 15 18 9"/></svg></div>
            </div>
          </div>
          <!-- 2FA Setting -->
          <div style="margin-top: 16px; padding: 16px; background: rgba(236,72,153,0.05); border-radius: 8px; border: 1px solid rgba(236,72,153,0.2); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 0.85rem; color: #ec4899; font-weight: 600; margin-bottom: 4px;">Enforce 2FA</div>
              <div style="font-size: 0.7rem; color: #a1a1aa;">Require two-factor authentication for all users</div>
            </div>
            <div style="width: 36px; height: 20px; background: #ec4899; border-radius: 10px; position: relative; box-shadow: 0 0 10px rgba(236,72,153,0.4);">
              <div style="width: 16px; height: 16px; background: #fff; border-radius: 50%; position: absolute; right: 2px; top: 2px;"></div>
            </div>
          </div>
        </div>
      </div>

    `
  }
]

const featuresEn = [
  {
    title: 'Quản lý dự án',
    desc: 'Tạo và quản lý nhiều dự án song song với đầy đủ thông tin về tiến độ, thành viên và trạng thái.',
    bg: '#09090b',
    glow: 'rgba(99,102,241,0.5)',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>`,
    items: [{ text: 'Màu sắc và mô tả', icon: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#60a5fa' stroke-width='2'><circle cx='13.5' cy='6.5' r='.5'/><circle cx='17.5' cy='10.5' r='.5'/><circle cx='8.5' cy='7.5' r='.5'/><circle cx='6.5' cy='12.5' r='.5'/><path d='M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z'/></svg>` }, { text: 'Thành viên dự án', icon: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#8b5cf6' stroke-width='2'><path d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M23 21v-2a4 4 0 00-3-3.87'/><path d='M16 3.13a4 4 0 010 7.75'/></svg>` }, { text: 'Tiến độ realtime', icon: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#10b981' stroke-width='2'><polyline points='22 12 18 12 15 21 9 3 6 12 2 12'/></svg>` }, { text: 'Lọc và tìm kiếm', icon: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#3b82f6' stroke-width='2'><circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/></svg>` }],
    mockupHtml: `

      <div class="mk-hud reveal-up" style="width: 100%; height: 100%; display: flex; background: #0f0f13; border-radius: 0 !important; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); font-family: sans-serif;">
        <!-- Sidebar -->
        <div style="width: 25%; background: #18181b; padding: 20px 15px; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; gap: 12px;">
          <div style="width: 80%; height: 16px; background: rgba(255,255,255,0.1); border-radius: 4px; margin-bottom: 16px;"></div>
          <div style="width: 60%; height: 12px; background: rgba(99,102,241,0.2); border-radius: 4px;"></div>
          <div style="width: 70%; height: 12px; background: rgba(255,255,255,0.05); border-radius: 4px;"></div>
          <div style="width: 50%; height: 12px; background: rgba(255,255,255,0.05); border-radius: 4px;"></div>
        </div>
        <!-- Main Content -->
        <div style="width: 75%; padding: 24px; display: flex; flex-direction: column;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <div style="font-size: 1.1rem; font-weight: 600; color: #fff;">Projects</div>
            <div style="padding: 6px 12px; background: #6366f1; color: #fff; font-size: 0.75rem; border-radius: 6px; font-weight: 500;">+ New Project</div>
          </div>
          <!-- Table Header -->
          <div style="display: flex; font-size: 0.7rem; color: #71717a; margin-bottom: 12px; text-transform: uppercase; font-weight: 600;">
            <div style="flex: 2;">Name</div>
            <div style="flex: 1;">Status</div>
            <div style="flex: 1.5;">Progress</div>
          </div>
          <!-- Table Row 1 -->
          <div class="float-anim" style="display: flex; align-items: center; padding: 12px 0; border-top: 1px solid rgba(255,255,255,0.05);">
            <div style="flex: 2; display: flex; align-items: center; gap: 8px;">
              <div style="width: 24px; height: 24px; border-radius: 6px; background: #6366f1; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #fff; font-weight: bold;">W</div>
              <div style="font-size: 0.85rem; color: #e4e4e7; font-weight: 500;">Website Redesign</div>
            </div>
            <div style="flex: 1;">
              <span style="background: rgba(16,185,129,0.15); color: #10b981; padding: 2px 8px; border-radius: 12px; font-size: 0.65rem; font-weight: 600;">Active</span>
            </div>
            <div style="flex: 1.5; display: flex; align-items: center; gap: 8px;">
              <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                <div style="width: 75%; height: 100%; background: #6366f1; border-radius: 3px;"></div>
              </div>
              <span style="font-size: 0.7rem; color: #a1a1aa;">75%</span>
            </div>
          </div>
          <!-- Table Row 2 -->
          <div class="float-anim-delayed" style="display: flex; align-items: center; padding: 12px 0; border-top: 1px solid rgba(255,255,255,0.05);">
            <div style="flex: 2; display: flex; align-items: center; gap: 8px;">
              <div style="width: 24px; height: 24px; border-radius: 6px; background: #f59e0b; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: #fff; font-weight: bold;">M</div>
              <div style="font-size: 0.85rem; color: #e4e4e7; font-weight: 500;">Mobile App</div>
            </div>
            <div style="flex: 1;">
              <span style="background: rgba(245,158,11,0.15); color: #f59e0b; padding: 2px 8px; border-radius: 12px; font-size: 0.65rem; font-weight: 600;">Paused</span>
            </div>
            <div style="flex: 1.5; display: flex; align-items: center; gap: 8px;">
              <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden;">
                <div style="width: 30%; height: 100%; background: #f59e0b; border-radius: 3px;"></div>
              </div>
              <span style="font-size: 0.7rem; color: #a1a1aa;">30%</span>
            </div>
          </div>
        </div>
      </div>

    `
  },
  {
    title: 'Bảng Kanban',
    desc: 'Hệ thống quản lý công việc trực quan theo phong cách Kanban. Nắm bắt tức thì ai đang làm gì, ở đâu.',
    bg: '#09090b',
    glow: 'rgba(139,92,246,0.5)',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7v7m8-7v4"/></svg>`,
    items: ['Kéo thả linh hoạt', 'Tùy chỉnh cột trạng thái', 'Gán thành viên, deadline', 'Đính kèm file & comment'],
    mockupHtml: `

      <div class="mk-hud reveal-up" style="width: 100%; height: 100%; padding: 24px; background: #121214; border-radius: 0 !important; border: 1px solid rgba(255,255,255,0.05); font-family: sans-serif;">
        <div style="font-size: 1rem; font-weight: 600; color: #fff; margin-bottom: 20px; display: flex; justify-content: space-between;">
          <span>Sprint 14 Board</span>
          <div style="display: flex; gap: -5px;">
            <div style="width: 20px; height: 20px; border-radius: 50%; background: #ec4899; border: 2px solid #121214;"></div>
            <div style="width: 20px; height: 20px; border-radius: 50%; background: #3b82f6; border: 2px solid #121214; margin-left: -8px;"></div>
            <div style="width: 20px; height: 20px; border-radius: 50%; background: #6366f1; border: 2px solid #121214; margin-left: -8px;"></div>
          </div>
        </div>
        <div style="display: flex; gap: 16px; height: calc(100% - 45px);">
          <!-- TO DO Column -->
          <div style="flex: 1; display: flex; flex-direction: column; gap: 12px;">
            <div style="font-size: 0.75rem; color: #a1a1aa; font-weight: 600;">TODO (1)</div>
            <div class="float-anim" style="background: #1f1f22; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
              <span style="background: rgba(239,68,68,0.15); color: #ef4444; padding: 2px 6px; border-radius: 4px; font-size: 0.6rem; font-weight: 600;">Bug</span>
              <div style="font-size: 0.8rem; color: #e4e4e7; font-weight: 500; margin: 8px 0;">Fix login API crash</div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#71717a" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <div style="width: 16px; height: 16px; border-radius: 50%; background: #ef4444;"></div>
              </div>
            </div>
          </div>
          <!-- IN PROGRESS Column -->
          <div style="flex: 1; display: flex; flex-direction: column; gap: 12px;">
            <div style="font-size: 0.75rem; color: #a1a1aa; font-weight: 600;">IN PROGRESS (1)</div>
            <div class="float-anim-delayed" style="background: #1f1f22; padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
              <span style="background: rgba(99,102,241,0.15); color: #6366f1; padding: 2px 6px; border-radius: 4px; font-size: 0.6rem; font-weight: 600;">Feature</span>
              <div style="font-size: 0.8rem; color: #e4e4e7; font-weight: 500; margin: 8px 0;">Implement Drag & Drop</div>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                <div style="display: flex; align-items: center; gap: 4px; font-size: 0.65rem; color: #71717a;">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg> 2
                </div>
                <div style="width: 16px; height: 16px; border-radius: 50%; background: #3b82f6;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

    `
  },
  {
    title: 'Thông báo Realtime',
    desc: 'Mọi thay đổi trong dự án đều được đồng bộ và thông báo ngay lập tức tới tất cả các thành viên liên quan.',
    bg: '#09090b',
    glow: 'rgba(16,185,129,0.5)',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>`,
    items: ['Cập nhật trạng thái tức thì', 'Giao tiếp qua chat bong bóng', 'Nhận thông báo khi được gán', 'Lịch sử hoạt động'],
    mockupHtml: `

      <div class="mk-hud reveal-up" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-image: radial-gradient(circle at center, rgba(16,185,129,0.1) 0%, transparent 70%);">
        <!-- Notification Dropdown UI -->
        <div class="pop-in" style="width: 300px; background: rgba(24,24,27,0.8); backdrop-filter: blur(12px); border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); font-family: sans-serif; overflow: hidden;">
          <div style="padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;">
            <div style="font-size: 0.9rem; font-weight: 600; color: #fff;">Notifications</div>
            <div style="font-size: 0.7rem; color: #10b981; cursor: pointer;">Mark all as read</div>
          </div>
          <!-- Item 1 (Unread) -->
          <div style="padding: 16px; display: flex; gap: 12px; background: rgba(255,255,255,0.02); border-left: 2px solid #10b981;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #3b82f6; flex-shrink: 0;"></div>
            <div style="flex: 1;">
              <div style="font-size: 0.8rem; color: #e4e4e7; margin-bottom: 4px; line-height: 1.4;">
                <span style="font-weight: 600; color: #fff;">David</span> assigned you to <span style="font-weight: 600;">Update Landing Page</span>
              </div>
              <div style="font-size: 0.65rem; color: #a1a1aa;">2 mins ago</div>
            </div>
            <div style="width: 8px; height: 8px; background: #10b981; border-radius: 50%; margin-top: 4px;"></div>
          </div>
          <!-- Item 2 (Read) -->
          <div style="padding: 16px; display: flex; gap: 12px; border-top: 1px solid rgba(255,255,255,0.05);">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #ec4899; flex-shrink: 0;"></div>
            <div style="flex: 1;">
              <div style="font-size: 0.8rem; color: #a1a1aa; margin-bottom: 4px; line-height: 1.4;">
                <span style="font-weight: 600; color: #e4e4e7;">Sarah</span> commented on <span style="font-weight: 600;">API Gateway Setup</span>
              </div>
              <div style="font-size: 0.65rem; color: #71717a;">1 hour ago</div>
            </div>
          </div>
        </div>
      </div>

    `
  },
  {
    title: 'Bảo mật & Phân quyền',
    desc: 'Bảo vệ dữ liệu tuyệt đối với hệ thống mã hóa JWT và cơ chế phân quyền RBAC chi tiết.',
    bg: '#09090b',
    glow: 'rgba(236,72,153,0.5)',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>`,
    items: [{ text: 'Xác thực JWT', icon: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#60a5fa' stroke-width='2'><path d='M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4'/></svg>` }, { text: 'Role-Based Access', icon: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#8b5cf6' stroke-width='2'><rect x='3' y='11' width='18' height='11' rx='2' ry='2'/><path d='M7 11V7a5 5 0 0110 0v4'/></svg>` }, { text: 'Admin / Member', icon: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#10b981' stroke-width='2'><path d='M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M23 21v-2a4 4 0 00-3-3.87'/><path d='M16 3.13a4 4 0 010 7.75'/></svg>` }, { text: 'Xác minh 2FA', icon: `<svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#f59e0b' stroke-width='2'><rect x='5' y='2' width='14' height='20' rx='2' ry='2'/><line x1='12' y1='18' x2='12.01' y2='18'/></svg>` }],
    mockupHtml: `

      <div class="mk-hud reveal-up" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-family: sans-serif;">
        <div class="float-anim" style="width: 90%; background: #18181b; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 20px 40px rgba(0,0,0,0.4); padding: 20px;">
          <div style="font-size: 1rem; font-weight: 600; color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ec4899" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            User Roles & Security
          </div>
          <!-- User Row 1 -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 28px; height: 28px; border-radius: 50%; background: #ec4899;"></div>
              <div>
                <div style="font-size: 0.85rem; color: #e4e4e7; font-weight: 500;">alex@company.com</div>
                <div style="font-size: 0.65rem; color: #71717a;">Last active: Just now</div>
              </div>
            </div>
            <div style="display: flex; gap: 12px; align-items: center;">
              <div style="background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; color: #fff; border: 1px solid rgba(255,255,255,0.1);">Admin <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline; margin-left:4px;"><polyline points="6 9 12 15 18 9"/></svg></div>
            </div>
          </div>
          <!-- User Row 2 -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <div style="width: 28px; height: 28px; border-radius: 50%; background: #3b82f6;"></div>
              <div>
                <div style="font-size: 0.85rem; color: #e4e4e7; font-weight: 500;">sarah@company.com</div>
                <div style="font-size: 0.65rem; color: #71717a;">Last active: 2 days ago</div>
              </div>
            </div>
            <div style="display: flex; gap: 12px; align-items: center;">
              <div style="background: rgba(255,255,255,0.05); padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; color: #a1a1aa; border: 1px solid rgba(255,255,255,0.1);">Member <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline; margin-left:4px;"><polyline points="6 9 12 15 18 9"/></svg></div>
            </div>
          </div>
          <!-- 2FA Setting -->
          <div style="margin-top: 16px; padding: 16px; background: rgba(236,72,153,0.05); border-radius: 8px; border: 1px solid rgba(236,72,153,0.2); display: flex; justify-content: space-between; align-items: center;">
            <div>
              <div style="font-size: 0.85rem; color: #ec4899; font-weight: 600; margin-bottom: 4px;">Enforce 2FA</div>
              <div style="font-size: 0.7rem; color: #a1a1aa;">Require two-factor authentication for all users</div>
            </div>
            <div style="width: 36px; height: 20px; background: #ec4899; border-radius: 10px; position: relative; box-shadow: 0 0 10px rgba(236,72,153,0.4);">
              <div style="width: 16px; height: 16px; background: #fff; border-radius: 50%; position: absolute; right: 2px; top: 2px;"></div>
            </div>
          </div>
        </div>
      </div>

    `
  }
]

const features = computed(() => currentLang.value === 'vi' ? featuresVi : featuresEn)

const stepsVi = [
  {
    title: 'Tạo tài khoản',
    desc: 'Đăng ký miễn phí với email và mật khẩu. Được cấp quyền Member ngay lập tức.',
    bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    glow: 'rgba(99,102,241,0.4)',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
  },
  {
    title: 'Tạo dự án & mời thành viên',
    desc: 'Tạo dự án mới, mời đồng nghiệp tham gia và phân công công việc ngay trong hệ thống.',
    bg: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    glow: 'rgba(245,158,11,0.4)',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`
  },
  {
    title: 'Làm việc & theo dõi',
    desc: 'Sử dụng Kanban board, bình luận, nhận thông báo và xem báo cáo tiến độ theo thời gian thực.',
    bg: 'linear-gradient(135deg, #10b981, #0ea5e9)',
    glow: 'rgba(16,185,129,0.4)',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`
  }
]

const stepsEn = [
  {
    title: 'Create Account',
    desc: 'Sign up for free with your email. Get Member access instantly.',
    bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    glow: 'rgba(99,102,241,0.4)',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
  },
  {
    title: 'Create Project & Invite',
    desc: 'Start a new project, invite colleagues, and assign tasks right away.',
    bg: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    glow: 'rgba(245,158,11,0.4)',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>`
  },
  {
    title: 'Work & Track',
    desc: 'Use Kanban boards, comment, get notifications, and view real-time progress.',
    bg: 'linear-gradient(135deg, #10b981, #0ea5e9)',
    glow: 'rgba(16,185,129,0.4)',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`
  }
]

const steps = computed(() => currentLang.value === 'vi' ? stepsVi : stepsEn)

const services = [
  {
    name: 'API Gateway',
    port: '7000',
    color: '#6366f1',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>`,
    features: ['Routing (Ocelot)', 'Load balancing', 'Auth forwarding']
  },
  {
    name: 'Project Service',
    port: '5001',
    color: '#f59e0b',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>`,
    features: ['CRUD dự án', 'Quản lý thành viên', 'Tiến độ & trạng thái']
  },
  {
    name: 'Task Service',
    port: '5002',
    color: '#ef4444',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    features: ['CRUD task & subtask', 'Kanban status', 'Work log & giờ làm']
  },
  {
    name: 'Notify Service',
    port: '5003',
    color: '#10b981',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/></svg>`,
    features: ['JWT Auth & Users', 'Comment & Activity log', 'Notifications & đã đọc']
  }
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
* { box-sizing: border-box; }

.landing {
  font-family: 'Inter', sans-serif;
  background: #09090b;
  color: #e4e4e7;
  overflow-x: clip;
}

/* ── PARTICLES ── */
.particle-canvas {
  position: fixed; inset: 0; z-index: 0;
  pointer-events: none;
}

/* ── SCROLL REVEAL ── */
.reveal-up {
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal-left {
  opacity: 0;
  transform: translateX(-50px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.reveal-right {
  opacity: 0;
  transform: translateX(50px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.reveal-up.revealed,
.reveal-left.revealed,
.reveal-right.revealed {
  opacity: 1;
  transform: none;
}

/* ── NAV ── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  transition: background 0.3s, border-color 0.3s, backdrop-filter 0.3s;
  border-bottom: 1px solid transparent;
}
.nav.scrolled {
  background: rgba(9,9,11,0.9);
  backdrop-filter: blur(20px);
  border-color: rgba(255,255,255,0.06);
}
.nav-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 2rem;
  display: flex; align-items: center; justify-content: space-between;
  height: 64px;
}
.nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
.logo-icon {
  width: 34px; height: 34px; border-radius: 10px;
  background: linear-gradient(135deg, #6366f1, #3b82f6);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(99,102,241,0.3);
  animation: logo-spin 8s linear infinite;
}
@keyframes logo-spin {
  0%, 90% { transform: rotate(0deg); }
  95% { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
}
.logo-icon.small { width: 28px; height: 28px; border-radius: 8px; animation: none; }
.logo-text { font-size: 1.25rem; font-weight: 700; color: #fff; letter-spacing: -0.5px; }

.nav-links { display: flex; align-items: center; gap: 2rem; }
.nav-link { color: #a1a1aa; font-size: 0.95rem; font-weight: 500; text-decoration: none; transition: color 0.2s; }
.nav-link:hover { color: #fff; }

.nav-lang-dropdown {
  position: relative; display: flex; align-items: center; gap: 6px;
  cursor: pointer; padding: 6px 12px; border-radius: 8px;
  background: rgba(255,255,255,0.05); color: #fff; font-size: 0.85rem;
  font-weight: 500; transition: background 0.2s; outline: none;
  border: 1px solid rgba(255,255,255,0.05);
}
.nav-lang-dropdown:hover { background: rgba(255,255,255,0.08); }
.lang-menu {
  position: absolute; top: 130%; right: 0; background: #18181b;
  border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
  padding: 6px; min-width: 140px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  display: flex; flex-direction: column; gap: 4px;
  z-index: 100; transform-origin: top right;
}
.lang-item {
  padding: 8px 12px; border-radius: 6px; display: flex; align-items: center; gap: 8px;
  transition: all 0.2s; color: #a1a1aa; font-size: 0.85rem;
}
.lang-item:hover, .lang-item.active { background: rgba(99,102,241,0.15); color: #fff; }

.btn-nav-login { color: #fff; font-size: 0.95rem; font-weight: 500; text-decoration: none; }
.btn-nav-register {
  position: relative; overflow: hidden;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff; font-size: 0.9rem; font-weight: 500;
  text-decoration: none; padding: 0.4rem 1.1rem;
  border-radius: 8px; transition: opacity 0.2s, transform 0.2s;
}
.btn-nav-register:hover { opacity: 0.85; transform: translateY(-1px); }

/* ── SHIMMER EFFECT ── */
.btn-shimmer {
  position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%);
  background-size: 200% 100%;
  animation: shimmer 2.5s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── HERO ── */
.hero {
  min-height: 100vh; position: relative;
  display: flex; align-items: center;
  padding: 100px 2rem 60px;
  max-width: 1200px; margin: 0 auto;
  gap: 4rem; z-index: 1;
}
.hero-bg {
  position: fixed; inset: 0; pointer-events: none; z-index: 0;
}
.hero-orb {
  position: absolute; border-radius: 50%;
  filter: blur(80px);
}
.orb-1 {
  width: 600px; height: 600px; background: #6366f1;
  top: -100px; left: -200px;
  opacity: 0.1;
  animation: orb-float 8s ease-in-out infinite;
}
.orb-2 {
  width: 400px; height: 400px; background: #8b5cf6;
  top: 200px; right: -100px;
  opacity: 0.08;
  animation: orb-float 10s ease-in-out infinite reverse;
}
.orb-3 {
  width: 300px; height: 300px; background: #10b981;
  bottom: 0; left: 40%;
  opacity: 0.06;
  animation: orb-float 12s ease-in-out infinite 2s;
}
@keyframes orb-float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-30px) scale(1.05); }
}
.hero-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: grid-move 20s linear infinite;
}
@keyframes grid-move {
  0% { background-position: 0 0; }
  100% { background-position: 60px 60px; }
}
.hero-content { flex: 1; position: relative; z-index: 1; }
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.3);
  color: #a5b4fc; font-size: 0.8rem; font-weight: 500;
  padding: 6px 14px; border-radius: 20px; margin-bottom: 1.5rem;
  animation: badge-slide 0.8s ease both;
}
@keyframes badge-slide {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.badge-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #6366f1; box-shadow: 0 0 8px #6366f1;
  animation: pulse-dot 2s infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; box-shadow: 0 0 8px #6366f1; }
  50% { opacity: 0.4; box-shadow: 0 0 2px #6366f1; }
}
.hero-title {
  font-size: clamp(2.5rem, 5vw, 3.8rem);
  font-weight: 900; line-height: 1.1;
  color: #fff; margin: 0 0 1.2rem;
}
.hero-gradient {
  background: linear-gradient(135deg, #6366f1, #a78bfa, #38bdf8);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: gradient-shift 4s ease infinite;
}
@keyframes gradient-shift {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 100% center; }
}
.typing-text { display: inline; }
.cursor {
  display: inline-block;
  -webkit-text-fill-color: #6366f1;
  animation: blink 0.8s step-end infinite;
  font-weight: 300;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.hero-desc {
  color: #71717a; font-size: 1.05rem; line-height: 1.7;
  max-width: 520px; margin-bottom: 2rem;
}
.hero-actions { display: flex; gap: 1rem; align-items: center; margin-bottom: 2.5rem; }

.btn-primary {
  position: relative; overflow: hidden;
  display: inline-flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff; font-weight: 600; font-size: 0.95rem;
  text-decoration: none; padding: 0.75rem 1.5rem;
  border-radius: 12px; transition: all 0.3s;
  box-shadow: 0 4px 20px rgba(99,102,241,0.4);
}
.btn-primary:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 40px rgba(99,102,241,0.6);
}
.btn-primary.large { padding: 1rem 2rem; font-size: 1rem; }
.btn-ghost {
  color: #a1a1aa; font-size: 0.95rem; text-decoration: none;
  transition: color 0.2s, letter-spacing 0.2s;
}
.btn-ghost:hover { color: #fff; letter-spacing: 0.5px; }

.hero-stats { display: flex; align-items: center; gap: 1.5rem; }
.stat-item { text-align: center; }
.stat-num {
  display: block; font-size: 1.6rem; font-weight: 800; color: #fff;
  transition: color 0.3s;
}
.stat-label { font-size: 0.75rem; color: #52525b; text-transform: uppercase; letter-spacing: 1px; }
.stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.08); }

/* ── HERO PREVIEW ── */
.hero-preview { flex: 1; position: relative; z-index: 1; min-width: 0; }
.preview-card {
  background: #141416;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 0 !important; overflow: hidden;
  box-shadow: 0 24px 80px rgba(0,0,0,0.6);
  transition: transform 0.3s, box-shadow 0.3s;
}
.preview-card:hover {
  transform: translateY(-6px) rotateX(2deg);
  box-shadow: 0 40px 100px rgba(0,0,0,0.7), 0 0 40px rgba(99,102,241,0.1);
}
.preview-header {
  background: #1c1c1e; padding: 12px 16px;
  display: flex; align-items: center; gap: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.preview-dots { display: flex; gap: 6px; }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.red { background: #ff5f57; }
.dot.yellow { background: #febc2e; }
.dot.green { background: #28c840; }
.preview-title-bar { font-size: 0.75rem; color: #52525b; flex: 1; text-align: center; }
.preview-body { display: flex; }
.preview-sidebar {
  width: 130px; background: #101012;
  padding: 12px 8px; border-right: 1px solid rgba(255,255,255,0.05);
  display: flex; flex-direction: column; gap: 4px;
}
.ps-item {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 10px; border-radius: 8px;
  font-size: 0.72rem; color: #52525b; cursor: pointer;
  transition: all 0.2s; position: relative;
}
.ps-item.active { background: rgba(99,102,241,0.15); color: #818cf8; }
.ps-item:hover:not(.active) { background: rgba(255,255,255,0.03); color: #a1a1aa; }
.badge-count {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  background: #ef4444; color: white; font-size: 0.6rem;
  width: 16px; height: 16px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  animation: bounce-badge 2s ease infinite;
}
@keyframes bounce-badge {
  0%, 100% { transform: translateY(-50%) scale(1); }
  50% { transform: translateY(-50%) scale(1.2); }
}
.preview-img-wrap {
  position: relative; overflow: hidden;
  border-radius: 0 0 12px 12px;
  max-height: 280px;
}
.preview-img {
  width: 100%; display: block;
  object-fit: cover; object-position: top;
  transition: transform 6s ease;
  animation: slow-pan 12s ease-in-out infinite alternate;
}
@keyframes slow-pan {
  from { transform: translateY(0); }
  to   { transform: translateY(-15%); }
}
.preview-img-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to bottom, transparent 60%, #141416);
  pointer-events: none;
}
.preview-main { flex: 1; padding: 14px; }
.pm-title { font-size: 0.8rem; font-weight: 600; color: #e4e4e7; margin-bottom: 10px; }
.pm-cards { display: flex; gap: 8px; margin-bottom: 12px; }
.pm-card { flex: 1; border-radius: 8px; padding: 10px 8px; text-align: center; transition: transform 0.2s; }
.pm-card:hover { transform: scale(1.05); }
.pm-card.blue { background: rgba(99,102,241,0.15); }
.pm-card.purple { background: rgba(139,92,246,0.15); }
.pm-card.green { background: rgba(16,185,129,0.15); }
.pm-card-num { font-size: 1.1rem; font-weight: 700; color: #fff; }
.pm-card-label { font-size: 0.6rem; color: #71717a; }
.pm-tasks { display: flex; flex-direction: column; gap: 6px; }
.pm-task-row {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 8px; background: rgba(255,255,255,0.02);
  border-radius: 6px; transition: background 0.2s;
}
.pm-task-row:hover { background: rgba(255,255,255,0.04); }
.task-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.task-dot.done { background: #10b981; }
.task-dot.progress { background: #f59e0b; animation: pulse-dot 1.5s infinite; }
.task-dot.todo { background: #52525b; }
.task-text { flex: 1; font-size: 0.68rem; color: #a1a1aa; }
.task-badge { font-size: 0.6rem; padding: 2px 6px; border-radius: 4px; }
.done-badge { background: rgba(16,185,129,0.15); color: #10b981; }
.prog-badge { background: rgba(245,158,11,0.15); color: #f59e0b; }
.todo-badge { background: rgba(82,82,91,0.15); color: #71717a; }

.float-card {
  position: absolute;
  background: rgba(20,20,22,0.95);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px; padding: 12px 16px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
}
.float-1 {
  bottom: -40px; left: -80px;
  display: flex; align-items: center; gap: 10px;
  animation: float 4s ease-in-out infinite;
}
.float-2 {
  top: -20px; right: -30px; min-width: 160px;
  animation: float 4s ease-in-out infinite 2s;
}
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(0.5deg); }
  66% { transform: translateY(-5px) rotate(-0.5deg); }
}
.fc-title { font-size: 0.75rem; font-weight: 600; color: #e4e4e7; }
.fc-sub { font-size: 0.65rem; color: #71717a; white-space: nowrap; }
.fc-progress-label { font-size: 0.7rem; color: #71717a; margin-bottom: 8px; }
.fc-progress-bar { background: rgba(255,255,255,0.08); border-radius: 4px; height: 6px; margin-bottom: 6px; }
.fc-progress-fill {
  width: 0%; height: 100%;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  border-radius: 4px;
  animation: fill-bar 2s ease 1s forwards;
}
@keyframes fill-bar { to { width: 72%; } }
.fc-progress-pct { font-size: 0.8rem; font-weight: 700; color: #a5b4fc; text-align: right; }

/* ── MARQUEE ── */
.marquee-wrap {
  overflow: hidden; padding: 1.2rem 0;
  border-top: 1px solid rgba(255,255,255,0.04);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  background: rgba(255,255,255,0.01);
  position: relative; z-index: 1;
}
.marquee-track {
  display: flex; gap: 0;
  animation: marquee 30s linear infinite;
  width: max-content;
}
.marquee-track:hover { animation-play-state: paused; }
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.marquee-item {
  display: flex; align-items: center; gap: 8px;
  padding: 0 2rem;
  font-size: 0.8rem; font-weight: 500; color: #52525b;
  white-space: nowrap; transition: color 0.2s;
}
.marquee-item:hover { color: #a5b4fc; }

/* ── SECTIONS COMMON ── */
.section-badge {
  display: inline-block;
  background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25);
  color: #a5b4fc; font-size: 0.78rem; font-weight: 600;
  padding: 5px 14px; border-radius: 20px; margin-bottom: 1rem;
  text-transform: uppercase; letter-spacing: 1px;
}
.section-badge.light { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.15); color: #a1a1aa; }
.section-title {
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 800; color: #fff; line-height: 1.2;
  margin: 0 0 1rem;
}
.section-sub { color: #71717a; font-size: 1rem; line-height: 1.7; max-width: 540px; }
.text-gradient {
  background: linear-gradient(135deg, #6366f1, #a78bfa, #38bdf8);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-size: 200% auto;
  animation: gradient-shift 4s ease infinite;
}
.text-gradient-light {
  background: linear-gradient(135deg, #a5b4fc, #7dd3fc);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}


/* ── FEATURES ── */
.features {
  padding: 100px 2rem;
  max-width: 1200px; margin: 0 auto;
  text-align: center; position: relative; z-index: 1;
  transition: background-color 0.8s ease;
}
.features > .section-sub { margin: 0 auto 2rem; }

.features-zigzag {
  display: flex; flex-direction: column; gap: 8rem;
  max-width: 1200px; margin: 0 auto; position: relative; z-index: 1;
}
.feat-row {
  display: flex; align-items: center; gap: 6rem;
}
.feat-row.row-reverse {
  flex-direction: row-reverse;
}
.feat-text {
  flex: 1; text-align: left;
}
.feat-image-wrap {
  flex: 1.2; position: relative;
  border-radius: 24px; overflow: hidden;
  box-shadow: 0 40px 80px -20px rgba(0,0,0,0.8);
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(20,20,22,0.8);
  transform-style: preserve-3d;
  transform: perspective(1000px) rotateY(-8deg) rotateX(4deg);
  transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.4s, box-shadow 0.4s;
}
.feat-row.row-reverse .feat-image-wrap {
  transform: perspective(1000px) rotateY(8deg) rotateX(4deg);
}
.feat-image-wrap:hover { 
  transform: perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1.04) translateY(-10px); 
  border-color: rgba(99,102,241,0.5); 
  box-shadow: 0 50px 100px -20px rgba(99,102,241,0.2), 0 0 40px rgba(99,102,241,0.1); 
}

@keyframes float-img {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
  100% { transform: translateY(0px); }
}

.feat-mockup-container {
  width: 100%; height: 100%; min-height: 400px;
  display: flex; align-items: center; justify-content: center;
  padding: 2rem;
  animation: float-img 6s ease-in-out infinite;
  opacity: 0.9; transition: opacity 0.5s;
}
.feat-image-wrap:hover .feat-mockup-container { opacity: 1; animation-play-state: paused; }



.feat-glow {
  position: absolute; inset: 0; opacity: 0; pointer-events: none;
  transition: opacity 0.5s; z-index: 2; mix-blend-mode: color-dodge;
}
.feat-image-wrap:hover .feat-glow { opacity: 0.8; }

.feat-icon {
  width: 54px; height: 54px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 1rem; position: relative; z-index: 2;
  border: 1px solid rgba(255,255,255,0.05);
  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.feat-row:hover .feat-icon { transform: scale(1.1) translateY(-4px) rotate(3deg); }
.feat-title {
  font-size: 1.8rem; font-weight: 800; color: #fff;
  margin-bottom: 1rem; position: relative; z-index: 2;
  letter-spacing: -0.5px;
}
.feat-desc {
  font-size: 1.05rem; color: #a1a1aa; line-height: 1.7;
  margin-bottom: 1rem; position: relative; z-index: 2;
}
/* BEAUTIFUL CENTERED FEAT LIST */
.feat-list {
  list-style: none; padding: 0; margin: 10px auto 0;
  display: flex; flex-direction: column; gap: 8px;
  align-items: center;
  position: relative; z-index: 2;
  width: 100%;
}
.feat-list li {
  font-size: 0.9rem; color: #e4e4e7; font-weight: 500;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255, 255, 255, 0.02);
  padding: 12px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  width: 100%;
  max-width: 320px;
  text-align: center;
}
.feat-list li:hover {
  transform: scale(1.03);
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(139, 92, 246, 0.3);
  color: #fff;
  box-shadow: 0 10px 25px rgba(139, 92, 246, 0.2);
}
.feat-list svg { color: #8b5cf6; flex-shrink: 0; }

@media (max-width: 900px) {
  .feat-row, .feat-row.row-reverse { flex-direction: column; gap: 3rem; min-height: auto; padding: 4rem 0; }
  .features-zigzag { gap: 0; }
}

/* ── HOW IT WORKS ── */
.how {
  padding: 100px 2rem;
  background: linear-gradient(180deg, transparent, rgba(99,102,241,0.04), transparent);
  position: relative; z-index: 1;
}
.how-inner { max-width: 900px; margin: 0 auto; text-align: center; }
.how-inner .section-sub { margin: 0 auto 3.5rem; }
.steps { display: flex; gap: 2rem; align-items: flex-start; }
.step { flex: 1; text-align: center; position: relative; transition: transform 0.3s; }
.step:hover { transform: translateY(-6px); }
.step-num {
  position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
  width: 24px; height: 24px; border-radius: 50%;
  background: #6366f1; color: white;
  font-size: 0.7rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  z-index: 2; box-shadow: 0 0 16px rgba(99,102,241,0.5);
}
.step-connector {
  position: absolute; top: 32px; left: calc(50% + 40px);
  width: calc(100% - 80px); height: 1px;
  border-top: 1px dashed rgba(99,102,241,0.3);
  animation: connector-glow 2s ease infinite alternate;
}
@keyframes connector-glow {
  from { border-color: rgba(99,102,241,0.2); }
  to { border-color: rgba(99,102,241,0.5); }
}
.step-icon {
  width: 64px; height: 64px; border-radius: 0 !important;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
  transition: transform 0.3s, box-shadow 0.3s;
}
.step:hover .step-icon {
  transform: scale(1.1);
  box-shadow: 0 16px 40px rgba(0,0,0,0.4);
}
.step-title { font-size: 1rem; font-weight: 700; color: #fff; margin: 0 0 0.5rem; }
.step-desc { font-size: 0.85rem; color: #71717a; line-height: 1.6; }

/* ── STATS/SERVICES ── */
.stats-section {
  padding: 100px 2rem; position: relative;
  background: linear-gradient(180deg, #09090b, #0d0d14, #09090b);
  z-index: 1;
}
.stats-bg { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
.stats-orb {
  position: absolute; width: 600px; height: 600px; border-radius: 50%;
  background: radial-gradient(circle, rgba(99,102,241,0.08), transparent);
  left: 50%; top: 50%; transform: translate(-50%, -50%);
  animation: orb-float 10s ease-in-out infinite;
}
.stats-inner { max-width: 1200px; margin: 0 auto; text-align: center; position: relative; }
.services-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;
  text-align: left; margin-top: 3rem;
}
.service-card {
  position: relative; overflow: hidden;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 0 !important; padding: 1.5rem;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.svc-pulse {
  position: absolute; top: 12px; right: 12px;
  width: 8px; height: 8px; border-radius: 50%;
  opacity: 0.7;
  animation: svc-pulse 2s ease infinite;
}
@keyframes svc-pulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 currentColor; }
  50% { transform: scale(1.2); box-shadow: 0 0 0 4px transparent; }
}
.service-card:hover {
  border-color: rgba(255,255,255,0.15);
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}
.svc-icon { margin-bottom: 0.8rem; transition: transform 0.3s; }
.service-card:hover .svc-icon { transform: scale(1.15) rotate(-5deg); }
.svc-name { font-size: 0.95rem; font-weight: 700; color: #fff; margin-bottom: 2px; }
.svc-port { font-size: 0.75rem; color: #52525b; margin-bottom: 1rem; }
.svc-features { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 5px; }
.svc-features li { font-size: 0.78rem; color: #71717a; padding-left: 12px; position: relative; transition: color 0.2s; }
.svc-features li::before { content: '·'; position: absolute; left: 0; color: #52525b; }
.service-card:hover .svc-features li { color: #a1a1aa; }

/* ── CTA ── */
.cta-section {
  padding: 100px 2rem; text-align: center; position: relative;
  overflow: hidden; z-index: 1;
}
.cta-orb {
  position: absolute; border-radius: 50%;
  filter: blur(80px); pointer-events: none;
}
.cta-orb-1 {
  width: 400px; height: 400px; background: rgba(99,102,241,0.15);
  left: -100px; top: -100px;
  animation: orb-float 8s ease-in-out infinite;
}
.cta-orb-2 {
  width: 300px; height: 300px; background: rgba(139,92,246,0.1);
  right: -50px; bottom: -50px;
  animation: orb-float 10s ease-in-out infinite reverse;
}
.cta-inner { position: relative; max-width: 600px; margin: 0 auto; }
.cta-emoji {
  font-size: 3rem; margin-bottom: 1rem;
  display: block;
  animation: emoji-bounce 2s ease infinite;
}
@keyframes emoji-bounce {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(5deg); }
  75% { transform: translateY(-5px) rotate(-3deg); }
}
.cta-title { font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: #fff; margin: 0 0 1rem; }
.cta-sub { color: #71717a; font-size: 1rem; line-height: 1.7; margin-bottom: 2.5rem; }
.cta-actions { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }
.btn-outline-white {
  display: inline-flex; align-items: center; gap: 8px;
  border: 1px solid rgba(255,255,255,0.15);
  color: #a1a1aa; font-size: 1rem; font-weight: 500;
  text-decoration: none; padding: 1rem 2rem; border-radius: 12px;
  transition: all 0.3s;
}
.btn-outline-white:hover {
  border-color: rgba(255,255,255,0.4);
  color: #fff;
  transform: translateY(-2px);
  background: rgba(255,255,255,0.05);
}

/* ── FOOTER ── */
.footer {
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 2rem; position: relative; z-index: 1;
}
.footer-inner {
  max-width: 1200px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 1rem;
}
.footer-logo { display: flex; align-items: center; gap: 10px; font-weight: 700; color: #fff; }
.footer-links { display: flex; gap: 1.5rem; }
.footer-links a { color: #52525b; font-size: 0.85rem; text-decoration: none; transition: color 0.2s; }
.footer-links a:hover { color: #a1a1aa; }
.footer-copy { font-size: 0.8rem; color: #3f3f46; }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .hero { flex-direction: column; padding-top: 100px; }
  .hero-preview { display: none; }
  .features-grid { grid-template-columns: 1fr; }
  .services-grid { grid-template-columns: repeat(2, 1fr); }
  .steps { flex-direction: column; }
  .step-connector { display: none; }
  .nav-links .btn-nav-login,
  .nav-links .nav-link { display: none; }
}
@media (max-width: 600px) {
  .services-grid { grid-template-columns: 1fr; }
  .footer-inner { flex-direction: column; text-align: center; }
}

/* STICKY STACKING CARDS */
.features-stack {
  padding-bottom: 20vh;
}
.stack-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 1100px;
  margin: 40px auto 0;
  position: relative;
}
.stack-card {
  position: sticky;
  height: 65vh;
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: top center;
  transition: transform 0.1s ease-out;
}
.card-inner {
  width: 100%;
  height: 100%;
  max-height: 550px;
  border-radius: 0 !important;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: row;
  overflow: hidden;
  box-shadow: 0 -10px 40px rgba(0,0,0,0.5);
}
.card-content {
  width: 45%;
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.card-image-wrap {
  width: 55%;
  height: 100%;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.2);
}
.feat-preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
}
@media (max-width: 768px) {
  .card-inner { flex-direction: column; }
  .card-content { width: 100%; padding: 30px; height: 50%; }
  .card-image-wrap { width: 100%; height: 50%; }
  .stack-card { height: 65vh; }
}



/* HORIZONTAL SCROLL SECTION */
.horizontal-scroll-section {
  height: 400vh; /* 4 panels * 100vh */
  position: relative;
  width: 100%;
  margin-top: 50px;
}
.sticky-wrapper {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.horizontal-header {
  position: absolute;
  top: 15vh;
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 10;
  pointer-events: none;
}

.horizontal-track {
  display: flex;
  width: max-content; /* Instead of 400vw */
  height: 100%;
  will-change: transform;
  align-items: center;
  margin-top: 20vh; /* space for header */
  gap: 3vw;
  padding: 0 10vw; /* padding at start and end */
}
.horizontal-panel {
  width: 80vw;
  max-width: 1000px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.svc-pane-content {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 0 !important;
  padding: 50px;
  display: flex;
  gap: 50px;
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);
  align-items: center;
  border-radius: 0 !important;
}
.svc-pane-text { flex: 1; text-align: left; }
.svc-pane-visual { flex: 1; }
.svc-pane-icon { 
  width: 60px; height: 60px; 
  border-radius: 20px; 
  background: var(--theme-color); 
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 24px;
}
.svc-pane-title { font-size: 2.2rem; font-weight: 800; color: #fff; margin-bottom: 16px; }
.svc-pane-desc { font-size: 1.1rem; color: #a1a1aa; line-height: 1.6; margin-bottom: 30px; }
.svc-pane-features { list-style: none; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.svc-pane-features li { display: flex; align-items: center; gap: 10px; color: #e4e4e7; font-size: 0.95rem; }
.svc-pane-features svg { color: var(--theme-color); }
.svc-mockup-area { 
  background: #09090b; 
  border: 1px solid rgba(255,255,255,0.08); 
  border-radius: 24px; 
  padding: 30px; 
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 50px rgba(var(--theme-color-rgb), 0.1);
  border-radius: 0 !important;
}
@media (max-width: 900px) {
  .svc-pane-content { flex-direction: column; padding: 30px;   border-radius: 0 !important;
}
  .horizontal-header { top: 5vh; }
  .horizontal-scroll-section { height: 400vh; }
  .svc-pane-features { grid-template-columns: 1fr; }
  .svc-mockup-area { height: 300px;   border-radius: 0 !important;
}
}

/* END HORIZONTAL SCROLL SECTION */


/* TRANSITION FOR STACKING CARDS */
.card-inner {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}




/* TWEAKS FOR SPACING AND SIZE */
.sticky-wrapper {
  justify-content: flex-start !important;
  padding-top: 12vh !important;
}
.ms-header {
  position: static !important;
  margin-bottom: 2vh !important;
}
.horizontal-track {
  margin-top: 0 !important;
  align-items: center !important;
}

.svc-pane-content {
  will-change: transform, opacity, filter;
  max-width: 900px;
  border-radius: 0 !important;
}


/* FEEDBACK 2 TWEAKS */

/* FEEDBACK 2 TWEAKS */
.stack-card {
  border-radius: 0 !important;
}
.how-graphic-item {
  width: 95% !important;
  max-width: 550px !important;
}

/* HOW IT WORKS SCROLL ANIMATION */
.how-scroll-wrapper {
  height: 400vh; /* 3 steps = 300vh + 100vh base */
  position: relative;
  background: #0f172a;
}
.how-sticky-container {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-top: 10vh;
}
.how-sticky-title {
  text-align: center;
  margin-bottom: 5vh;
}
.how-split {
  display: flex;
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
}
.how-left {
  flex: 1;
  position: relative;
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 40px;
}
.how-step-card {
  position: absolute;
  top: 50%;
  left: 40px;
  right: 40px;
  margin-top: -80px; /* half height approx */
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 30px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  will-change: transform, opacity, filter;
  opacity: 0;
}
.how-step-card .step-v-title { color: #fff; font-size: 1.5rem; margin-bottom: 10px; }
.how-step-card .step-v-desc { color: rgba(255,255,255,0.7); line-height: 1.6; }

.how-right {
  flex: 1;
  position: relative;
  height: 60vh;
  perspective: 1000px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.how-graphic-item {
  position: absolute;
  width: 80%;
  max-width: 400px;
  will-change: transform, opacity;
  opacity: 0;
}
.glass-panel {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  overflow: hidden;
}
.mockup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 15px 20px;
  background: rgba(0,0,0,0.3);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.mockup-title { font-size: 12px; color: rgba(255,255,255,0.5); margin-left: 10px; }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.red { background: #ef4444; } .dot.yellow { background: #f59e0b; } .dot.green { background: #10b981; }
.mockup-body { padding: 30px; display: flex; flex-direction: column; gap: 15px; }
.mockup-body.align-center { align-items: center; }
.mockup-body.row-layout { flex-direction: row; align-items: stretch; gap: 15px; }

.fake-input { width: 100%; height: 40px; border-radius: 8px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.3); display: flex; align-items: center; padding: 0 15px; font-size: 14px; }
.fake-btn { width: 100%; height: 40px; border-radius: 8px; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; cursor: pointer; }
.fake-project-card { background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 15px; }
.fpc-title { color: #fff; font-weight: 600; }
.fpc-avatars { display: flex; gap: 5px; }
.fpc-avatar { width: 24px; height: 24px; border-radius: 50%; }

.kanban-col { flex: 1; background: rgba(0,0,0,0.3); border-radius: 12px; padding: 15px; display: flex; flex-direction: column; gap: 10px; }
.k-title { font-size: 12px; color: rgba(255,255,255,0.5); font-weight: bold; }
.k-card { height: 60px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }

@media (max-width: 768px) {
  .how-split { flex-direction: column; }
  .how-left, .how-right { height: 40vh; padding: 0 20px; width: 100%; }
  .how-step-card { position: static; margin-top: 0; opacity: 1; transform: none !important; filter: none !important; display: none; }
  .how-step-card.active-mobile { display: flex; } /* fallback for mobile */
  .how-scroll-wrapper { height: auto; padding-bottom: 50px; }
  .how-sticky-container { position: static; height: auto; overflow: visible; }
  .how-graphic-item { position: relative; opacity: 1; transform: none !important; width: 100%; display: none; }
  .how-graphic-item.active-mobile { display: block; }
}

/* MICROSERVICES TWEAKS */

.horizontal-panel {
  border: none !important;
  border-radius: 0 !important;
}
.svc-pane-icon {
  display: none !important;
}

/* APPLE-STYLE HORIZONTAL SCROLL */
.horizontal-scroll-section {
  height: 400vh; /* 4 panels */
  position: relative;
  width: 100%;
}
.sticky-wrapper {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.ms-header {
  text-align: center;
  position: absolute;
  top: 12vh;
  left: 0;
  width: 100%;
  z-index: 10;
}
.horizontal-track {
  display: flex;
  width: 400vw;
  height: 100%;
  will-change: transform;
  align-items: center;
  margin-top: 25vh; /* space for header */
}
.horizontal-panel {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 5vw;
}

@media (max-width: 900px) {
  .horizontal-track { margin-top: 20vh; }
}

/* Fix missing card-inner transition for non-scroll states */
.card-inner {
  will-change: transform, filter, opacity;
  /* Removed CSS transition because it fights with scroll-based instant updates */
}

/* MICROSERVICES HORIZONTAL SNAP SCROLL */
.ms-section { display: none;
  width: 100%;
  padding: 100px 0;
  position: relative;
  z-index: 10;
}
.ms-header {
  text-align: center;
  margin-bottom: 60px;
}
.ms-horizontal-container { display: none;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  gap: 40px;
  padding: 0 5vw 50px 5vw;
  scrollbar-width: none; /* Firefox */
}
.ms-horizontal-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}
.ms-panel {
  flex: 0 0 90vw;
  max-width: 1100px;
  scroll-snap-align: center;
  display: flex;
  justify-content: center;
}
.svc-pane-content {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 0 !important;
  padding: 50px;
  display: flex;
  gap: 50px;
  width: 100%;
  box-shadow: 0 40px 100px rgba(0,0,0,0.4);
  align-items: center;
  position: relative;
  overflow: hidden;
  border-radius: 0 !important;
}
.svc-pane-content::before {
  content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 5px;
  background: var(--theme-color);
  box-shadow: 0 0 20px var(--theme-color);
}
.svc-title-row {
  display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
}
.svc-pane-title { margin: 0; font-size: 2.2rem; font-weight: 800; color: #fff; }
.svc-port-badge {
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
  padding: 4px 12px; border-radius: 100px; font-size: 0.85rem; font-family: monospace; color: var(--theme-color);
}

/* PREMIUM MOCKUPS */
.svc-mockup-area {
  background: #09090b;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  padding: 30px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 50px rgba(0,0,0,0.5);
  position: relative;
  overflow: hidden;
  border-radius: 0 !important;
}

/* API Mockup */
.ms-mockup-api { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 20px; }
.ms-client-box { background: #1e293b; padding: 12px 24px; border-radius: 12px; border: 1px solid #334155; font-weight: bold; }
.ms-api-beams { display: flex; gap: 40px; height: 60px; position: relative; width: 200px; justify-content: center;}
.ms-beam { width: 2px; height: 100%; background: linear-gradient(to bottom, transparent, var(--theme-color), transparent); animation: beamSlide 1.5s infinite linear; opacity: 0; }
.ms-beam.delay-1 { animation-delay: 0.5s; }
.ms-beam.delay-2 { animation-delay: 1s; }
@keyframes beamSlide { 0% { transform: translateY(-100%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(100%); opacity: 0; } }
.ms-gateway-box { background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2)); border: 1px solid rgba(99,102,241,0.5); padding: 20px 40px; border-radius: 0 !important; text-align: center; position: relative; box-shadow: 0 0 30px rgba(99,102,241,0.2); }
.ms-shield-icon { font-size: 24px; margin-bottom: 8px; }
.ms-jwt-badge { position: absolute; top: -12px; right: -20px; background: #10b981; color: #000; font-size: 0.7rem; padding: 4px 8px; border-radius: 100px; font-weight: bold; animation: pulseBadge 2s infinite; }
@keyframes pulseBadge { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); box-shadow: 0 0 15px #10b981; } }
.ms-microservices-grid { display: flex; gap: 20px; margin-top: 20px; }
.ms-micro-box { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-top: 3px solid var(--c); padding: 15px 20px; border-radius: 12px; font-size: 0.9rem; font-weight: 600; color: #cbd5e1; }

/* Project Mockup */
.ms-mockup-project { width: 100%; }
.ms-window { background: #0f172a; border-radius: 0 !important; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
.ms-win-header { background: #1e293b; padding: 12px 16px; display: flex; align-items: center; gap: 16px; }
.ms-win-dots span { display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ef4444; margin-right: 6px; }
.ms-win-dots span:nth-child(2) { background: #f59e0b; }
.ms-win-dots span:nth-child(3) { background: #10b981; margin: 0; }
.ms-win-title { font-size: 0.85rem; color: #94a3b8; font-family: monospace; }
.ms-win-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.ms-proj-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; transition: 0.3s; }
.ms-proj-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.1); }
.ms-proj-top { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.ms-proj-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #fff; font-size: 0.9rem; }
.ms-proj-name { flex: 1; font-weight: 600; color: #e2e8f0; }
.ms-proj-badge { background: rgba(99,102,241,0.1); color: #818cf8; font-size: 0.75rem; padding: 4px 10px; border-radius: 100px; font-weight: 600; }
.ms-proj-bar { height: 6px; background: rgba(255,255,255,0.1); border-radius: 100px; overflow: hidden; }
.ms-proj-fill { height: 100%; border-radius: 100px; animation: loadBar 1.5s ease-out forwards; transform-origin: left; }
@keyframes loadBar { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }

/* Task Mockup */
.ms-mockup-task { width: 100%; height: 100%; }
.ms-kanban { display: flex; gap: 16px; height: 100%; }
.ms-kb-col { flex: 1; background: rgba(255,255,255,0.02); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 12px; border: 1px dashed rgba(255,255,255,0.05); }
.ms-kb-title { font-size: 0.85rem; font-weight: 700; color: #94a3b8; display: flex; justify-content: space-between; margin-bottom: 10px; }
.ms-kb-title span { background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 100px; }
.ms-kb-card { background: #1e293b; height: 60px; border-radius: 8px; border: 1px solid #334155; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.ms-kb-card.done { opacity: 0.5; height: 40px; }
.kb-anim-drag { animation: kbDrag 4s infinite cubic-bezier(0.25, 1, 0.5, 1); position: relative; z-index: 10; border-color: #ef4444; box-shadow: 0 10px 20px rgba(239,68,68,0.2); }
@keyframes kbDrag { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-150px, -20px) rotate(-5deg); } }

/* Notify Mockup */
.ms-mockup-notify { width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 40px; }
.ms-bell-container { position: relative; }
.ms-bell-icon { animation: bellShake 3s infinite; transform-origin: top center; }
.ms-bell-badge { position: absolute; top: 0; right: 0; background: #ef4444; color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold; border: 2px solid #09090b; }
.ms-bell-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 64px; height: 64px; border-radius: 50%; border: 2px solid #10b981; animation: ringPulse 2s infinite cubic-bezier(0.16, 1, 0.3, 1); opacity: 0; }
.ms-bell-ring.delay-1 { animation-delay: 1s; }
@keyframes bellShake { 0%, 10%, 100% { transform: rotate(0); } 2% { transform: rotate(15deg); } 4% { transform: rotate(-15deg); } 6% { transform: rotate(10deg); } 8% { transform: rotate(-10deg); } }
@keyframes ringPulse { 0% { width: 64px; height: 64px; opacity: 1; } 100% { width: 150px; height: 150px; opacity: 0; } }
.ms-toast-popup { background: #1e293b; border-left: 4px solid #10b981; padding: 16px 20px; border-radius: 8px; display: flex; align-items: center; gap: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); animation: toastSlide 4s infinite cubic-bezier(0.16, 1, 0.3, 1); opacity: 0; transform: translateY(20px); }
.ms-toast-icon { width: 30px; height: 30px; background: rgba(16,185,129,0.2); color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
.ms-toast-text { color: #e2e8f0; font-size: 0.95rem; }
.ms-toast-text span { display: block; font-size: 0.75rem; color: #64748b; margin-top: 4px; }
@keyframes toastSlide { 0%, 100% { opacity: 0; transform: translateY(20px); } 15%, 85% { opacity: 1; transform: translateY(0); } }

/* REMOVE OLD BUGGY CSS IF IT EXISTS */


/* SAAS EXTRAS */
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
.title-text { color: #e4e4e7; }
.sub-text { color: #a1a1aa; }


/* LIGHT THEME OVERRIDES */
.landing.light-theme {
  background: #f8fafc;
  color: #0f172a;
}
.landing.light-theme .nav {
  background: rgba(248, 250, 252, 0.8);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.landing.light-theme .logo-text,
.landing.light-theme .nav-link,
.landing.light-theme .btn-nav-login,
.landing.light-theme .hero-title,
.landing.light-theme .title-text,
.landing.light-theme .feat-title,
.landing.light-theme .step-title,
.landing.light-theme .section-title,
.landing.light-theme .svc-name,
.landing.light-theme .stat-val {
  color: #0f172a !important;
}

.landing.light-theme .hero-desc,
.landing.light-theme .sub-text,
.landing.light-theme .feat-desc,
.landing.light-theme .feat-list li,
.landing.light-theme .step-desc,
.landing.light-theme .section-sub,
.landing.light-theme .svc-port,
.landing.light-theme .svc-features li,
.landing.light-theme .marquee-item,
.landing.light-theme .stat-label {
  color: #475569 !important;
}

.landing.light-theme .section-badge {
  background: rgba(0,0,0,0.05) !important;
  color: #475569 !important;
  border-color: rgba(0,0,0,0.1) !important;
}

.landing.light-theme .step-num {
  color: rgba(0,0,0,0.05) !important;
}

.landing.light-theme .theme-toggle {
  background: rgba(0,0,0,0.05) !important;
  color: #0f172a !important;
}
.landing.light-theme .hero-mockup {
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
}
.landing.light-theme .hm-sidebar { background: #f1f5f9; border-right-color: rgba(0,0,0,0.05); }
.landing.light-theme .card-inner {
  background: #ffffff !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05) !important;
}
.landing.light-theme .card-image-wrap {
  background: #f8fafc !important;
}
.landing.light-theme .mk-premium {
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
}
.landing.light-theme .mk-header { background: #f1f5f9; border-bottom-color: rgba(0,0,0,0.05); }
.landing.light-theme .mk-glass {
  background: #ffffff !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05) !important;
}
.landing.light-theme .mk-title,
.landing.light-theme .mk-text-sm,
.landing.light-theme .mk-col-title,
.landing.light-theme .mk-setting-desc {
  color: #64748b !important;
}
.landing.light-theme .mk-bubble.mk-left { color: #0f172a !important; }
.landing.light-theme .mk-bubble.mk-right { color: white !important; }
.landing.light-theme .mk-toast {
  background: #ffffff !important;
  color: #0f172a !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
}
.landing.light-theme .mk-setting-title { color: #0f172a !important; }
.landing.light-theme .mk-toggle { border-color: rgba(0,0,0,0.1) !important; background: rgba(0,0,0,0.05) !important; }
.landing.light-theme .mk-task-card { background: #ffffff !important; border: 1px solid rgba(0,0,0,0.1) !important; box-shadow: 0 4px 10px rgba(0,0,0,0.02) !important; }

.landing.light-theme .testimonial-card,
.landing.light-theme .p-card {
  background: #ffffff !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
}
.landing.light-theme .p-card .btn-outline {
  border-color: rgba(0, 0, 0, 0.2) !important;
  color: #0f172a !important;
}
.landing.light-theme .pricing-section { background: #f8fafc !important; border-top-color: rgba(0,0,0,0.05) !important; }
.landing.light-theme .testimonials-section { border-top-color: rgba(0,0,0,0.05) !important; }
.landing.light-theme .cta-section { background: #f8fafc !important; }
/* Removed ugly cta-inner box */
.landing.light-theme .cta-title { color: #0f172a !important; }
.landing.light-theme .cta-sub { color: #475569 !important; }
.landing.light-theme .footer { border-top-color: rgba(0,0,0,0.05) !important; }
.landing.light-theme .footer-text { color: #64748b !important; }
.landing.light-theme .stats-section { background: #f8fafc !important; }
.landing.light-theme .service-card { background: #ffffff !important; border: 1px solid rgba(0,0,0,0.1) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.05) !important; }

.landing.light-theme .btn-outline-white {
  color: #0f172a !important;
  border-color: rgba(0, 0, 0, 0.2) !important;
}
.landing.light-theme .btn-outline-white:hover {
  background: rgba(0, 0, 0, 0.05) !important;
}

/* BETTER ANIMATIONS */
.cta-inner {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s ease;
}
.cta-inner:hover {
  transform: translateY(-5px) scale(1.01);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1) !important;
}

.btn-primary.large {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-primary.large:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(99, 102, 241, 0.4);
}

.btn-outline-white {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-outline-white:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
}

/* Floating animation for mockups */
@keyframes float-soft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.hero-mockup {
  animation: float-soft 6s ease-in-out infinite;
}


/* FOOTER AND NAV FIXES */
.landing.light-theme .footer-logo span { color: #0f172a !important; }
.landing.light-theme .footer-links a { color: #64748b !important; }
.landing.light-theme .footer-links a:hover { color: #6366f1 !important; }
.landing.light-theme .footer-copy { color: #94a3b8 !important; }

.landing.light-theme .nav-lang-dropdown { border-color: rgba(0,0,0,0.1) !important; background: rgba(0,0,0,0.03) !important; }
.landing.light-theme .nav-lang-dropdown .current-lang { color: #0f172a !important; }
.landing.light-theme .nav-lang-dropdown svg { stroke: #0f172a !important; }
.landing.light-theme .lang-menu { background: #ffffff !important; border: 1px solid rgba(0,0,0,0.1) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important; }
.landing.light-theme .lang-item { color: #475569 !important; }
.landing.light-theme .lang-item:hover { background: #f1f5f9 !important; color: #0f172a !important; }
.landing.light-theme .lang-item.active { background: rgba(99, 102, 241, 0.1) !important; color: #6366f1 !important; }


/* ENHANCED CONTINUOUS ANIMATIONS */
@keyframes continuous-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@keyframes continuous-pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
}

.cta-inner {
  animation: continuous-float 6s ease-in-out infinite;
}
.cta-inner:hover {
  animation-play-state: paused;
}

.cta-orb-1, .cta-orb-2 {
  animation: continuous-pulse 8s ease-in-out infinite alternate !important;
}

.hero-mockup {
  animation: continuous-float 7s ease-in-out infinite;
}
.hero-mockup:hover {
  animation-play-state: paused;
}


/* HUD & ADVANCED ANIMATIONS (2026) */
.mk-hud {
  display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;
}
.float-anim {
  animation: hud-float 6s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate;
}
.float-anim-delayed {
  animation: hud-float 6s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate;
  animation-delay: -3s;
}
@keyframes hud-float {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-15px); }
}

/* Fix sticky card inner clipping */
.card-inner {
  max-height: 85vh !important;
  overflow: visible !important;
}

/* Light theme overrides for HUD */
.landing.light-theme .mk-hud .mk-glass {
  background: rgba(255,255,255,0.7) !important;
  border: 1px solid rgba(0,0,0,0.05) !important;
  box-shadow: 0 30px 60px rgba(0,0,0,0.05) !important;
}
.landing.light-theme .mk-hud .mk-setting-title,
.landing.light-theme .mk-hud .mk-bubble.mk-left,
.landing.light-theme .mk-hud .mk-toast {
  color: #0f172a !important;
}
.landing.light-theme .mk-hud .mk-bubble.mk-right {
  color: #ffffff !important; /* Keep gradient text white */
}


/* VERTICAL TIMELINE DESIGN */
.steps-vertical {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  max-width: 700px;
  margin: 40px auto 0;
  position: relative;
  text-align: left;
}
.steps-vertical::before {
  content: '';
  position: absolute;
  top: 40px; bottom: 0;
  left: 40px;
  width: 2px;
  background: linear-gradient(180deg, rgba(99,102,241,0.5) 0%, rgba(236,72,153,0.1) 100%);
  z-index: 0;
}

.step-v {
  display: flex;
  align-items: flex-start;
  gap: 3rem;
  position: relative;
  z-index: 1;
}

.step-v-icon-wrap {
  position: relative;
  flex-shrink: 0;
}

.step-v-icon {
  width: 80px; height: 80px;
  border-radius: 24px;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  z-index: 2;
}

.step-v-num {
  position: absolute;
  top: -12px; right: -12px;
  width: 28px; height: 28px;
  border-radius: 50%;
  background: #ffffff; color: #0f172a;
  font-size: 0.8rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  z-index: 3;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.step-v-content {
  padding-top: 10px;
}
.step-v-title {
  font-size: 1.8rem; font-weight: 800; color: white; margin-bottom: 0.5rem;
}
.step-v-desc {
  font-size: 1.1rem; color: rgba(255,255,255,0.7); line-height: 1.6;
}

/* NEW ADVANCED SLIDE-RIGHT ANIMATION */
.reveal-slide-right {
  opacity: 0;
  transform: translateX(-60px);
  transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-slide-right.revealed {
  opacity: 1;
  transform: translateX(0);
}

/* Light theme overrides for vertical steps */
.landing.light-theme .step-v-title { color: #0f172a !important; }
.landing.light-theme .step-v-desc { color: #475569 !important; }
.landing.light-theme .step-v-num { background: #0f172a; color: #ffffff; }

/* Responsive */
@media (max-width: 768px) {
  .steps-vertical { gap: 3rem; }
  .steps-vertical::before { left: 30px; }
  .step-v { gap: 1.5rem; }
  .step-v-icon { width: 60px; height: 60px; border-radius: 0 !important; }
  .step-v-title { font-size: 1.4rem; }
  .step-v-desc { font-size: 0.95rem; }
}


/* SERVICES 2x2 GRID UPGRADE */
.services-grid {
  display: grid; 
  grid-template-columns: repeat(2, 1fr) !important; 
  gap: 2.5rem !important;
  text-align: left; 
  margin-top: 4rem;
}

.service-card {
  background: rgba(255,255,255,0.02) !important;
  border: 1px solid rgba(255,255,255,0.05) !important;
  border-radius: 32px !important;
  padding: 2.5rem !important;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.service-card:hover {
  transform: translateY(-8px) scale(1.02);
  background: rgba(255,255,255,0.04) !important;
  border-color: var(--theme-color) !important;
  box-shadow: 0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1) !important;
}

.svc-name-large {
  font-size: 1.6rem;
  font-weight: 800;
  color: white;
  margin-bottom: 6px;
  letter-spacing: -0.5px;
}
.svc-port-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 600;
}

.svc-features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.svc-features-grid li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255,255,255,0.7);
  font-size: 1.05rem;
  transition: color 0.3s;
}
.service-card:hover .svc-features-grid li {
  color: rgba(255,255,255,0.95);
}

/* Light Theme overrides for wide cards */
.landing.light-theme .svc-name-large { color: #0f172a !important; }
.landing.light-theme .svc-features-grid li { color: #475569 !important; }
.landing.light-theme .service-card {
  background: #ffffff !important;
  border-color: rgba(0,0,0,0.1) !important;
  box-shadow: 0 20px 40px rgba(0,0,0,0.03) !important;
}
.landing.light-theme .service-card:hover {
  box-shadow: 0 40px 80px rgba(0,0,0,0.1) !important;
}
.landing.light-theme .svc-icon-wrap {
  background: #f8fafc !important;
  border-color: rgba(0,0,0,0.05) !important;
}

@media (max-width: 900px) {
  .services-grid { grid-template-columns: 1fr !important; }
  .svc-features-grid { grid-template-columns: 1fr; }
}


/* SERVICES TABS & CSS MOCKUPS */
.services-tabs-container {
  display: flex; gap: 2rem;
  margin-top: 4rem;
  text-align: left;
  max-width: 1100px;
  margin-left: auto; margin-right: auto;
}

.svc-tabs-list {
  display: flex; flex-direction: column; gap: 12px;
  width: 300px; flex-shrink: 0;
}

.svc-tab-item {
  display: flex; align-items: center; gap: 16px;
  padding: 20px 24px;
  border-radius: 0 !important;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  color: rgba(255,255,255,0.6);
}

.svc-tab-item:hover {
  background: rgba(255,255,255,0.05);
  color: white;
}

.svc-tab-item.active {
  background: rgba(255,255,255,0.08);
  border-color: var(--theme-color);
  color: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.svc-tab-icon {
  width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  transition: color 0.3s;
}

.svc-tab-item.active .svc-tab-icon {
  color: var(--theme-color);
  filter: drop-shadow(0 0 8px var(--theme-color));
}

.svc-tab-name {
  font-size: 1.1rem; font-weight: 600;
}

.svc-tabs-content {
  flex-grow: 1;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 24px;
  padding: 3rem;
  position: relative;
  overflow: hidden;
  display: flex; flex-direction: column;
}

.svc-pane-top {
  margin-bottom: 3rem;
}

.svc-pane-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 2rem;
}

.svc-pane-title {
  font-size: 2.2rem; font-weight: 800; color: white; margin: 0;
}

.svc-port-badge {
  display: inline-block; padding: 6px 16px;
  border-radius: 12px;
  background: rgba(255,255,255,0.05);
  color: var(--theme-color);
  font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; font-weight: 700;
  border: 1px solid var(--theme-color);
}

.svc-pane-features {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
  list-style: none; padding: 0; margin: 0;
}
.svc-pane-features li {
  display: flex; align-items: center; gap: 12px;
  color: rgba(255,255,255,0.8); font-size: 1.1rem;
}

/* Transitions */
.fade-up-enter-active, .fade-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-up-enter-from { opacity: 0; transform: translateY(20px); }
.fade-up-leave-to { opacity: 0; transform: translateY(-20px); }

/* --- CSS MOCKUPS --- */
.svc-mockup-area {
  height: 250px;
  background: rgba(0,0,0,0.2);
  border-radius: 0 !important;
  border: 1px solid rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
  border-radius: 0 !important;
}

/* Tab 0: API Mockup */
.mockup-api { display: flex; align-items: center; gap: 20px; }
.api-node {
  padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 0.9rem;
  background: #1e1e24; border: 2px solid rgba(255,255,255,0.1); color: white;
  position: relative; z-index: 2;
}
.api-node.gateway {
  border-color: #6366f1; box-shadow: 0 0 20px rgba(99,102,241,0.4);
  padding: 20px 30px; font-size: 1.1rem;
}
.api-node.proj { border-color: #f59e0b; }
.api-node.task { border-color: #ef4444; }
.api-node.noti { border-color: #10b981; }

.api-line, .api-line-out {
  height: 2px; background: rgba(255,255,255,0.1); position: relative;
}
.api-line { width: 50px; }
.api-lines-out { display: flex; flex-direction: column; gap: 28px; justify-content: center; height: 120px; }
.api-line-out { width: 40px; }

.api-dot {
  width: 8px; height: 8px; border-radius: 50%; background: white;
  position: absolute; top: -3px; left: 0;
  box-shadow: 0 0 10px white;
  animation: api-flow 1.5s infinite linear;
}
@keyframes api-flow {
  0% { left: 0; opacity: 1; }
  100% { left: 100%; opacity: 0; }
}
.api-services { display: flex; flex-direction: column; gap: 12px; }

/* Tab 1: Project Mockup */
.mockup-project {
  width: 350px; background: #18181b; border-radius: 0 !important; border: 1px solid rgba(255,255,255,0.05);
  padding: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  animation: float 4s ease-in-out infinite alternate;
}
.pj-header { font-size: 1.1rem; font-weight: 700; color: white; margin-bottom: 16px; }
.pj-list { display: flex; flex-direction: column; gap: 12px; }
.pj-item {
  background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px;
  animation: slide-right 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}
.pj-info { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.pj-avatar { width: 24px; height: 24px; border-radius: 6px; }
.pj-name { font-size: 0.9rem; color: #e4e4e7; font-weight: 600; }
.pj-progress { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
.pj-fill { height: 100%; animation: fill-bar 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; transform-origin: left; transform: scaleX(0); }
@keyframes fill-bar { to { transform: scaleX(1); } }
@keyframes slide-right { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }

/* Tab 2: Task Mockup */
.mockup-task {
  display: flex; gap: 16px; transform: rotateX(10deg) rotateZ(-5deg); perspective: 1000px;
  transform-style: preserve-3d;
}
.kb-col {
  width: 120px; background: rgba(255,255,255,0.02); border-radius: 12px; padding: 12px;
  border: 1px solid rgba(255,255,255,0.05);
}
.kb-title { font-size: 0.7rem; font-weight: 700; color: #a1a1aa; margin-bottom: 12px; letter-spacing: 1px; }
.kb-card {
  height: 40px; background: #27272a; border-radius: 6px; margin-bottom: 8px;
  border: 1px solid rgba(255,255,255,0.05);
}
.kb-drag {
  border-color: #ef4444; box-shadow: 0 10px 20px rgba(239,68,68,0.3);
  transform: translateZ(20px) rotate(-3deg);
  animation: kb-float 3s infinite alternate;
}
@keyframes kb-float { to { transform: translateZ(30px) rotate(-3deg) translateY(-10px); } }

/* Tab 3: Notify Mockup */
.mockup-notify {
  display: flex; flex-direction: column; align-items: center; gap: 24px;
}
.nf-bell {
  position: relative; animation: bell-shake 4s infinite;
}
.nf-badge {
  position: absolute; top: -5px; right: -5px; width: 20px; height: 20px; border-radius: 50%;
  background: #ef4444; color: white; font-size: 0.7rem; font-weight: bold;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 10px rgba(239,68,68,0.5);
}
.nf-ring {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 60px; height: 60px; border-radius: 50%;
  border: 2px solid var(--theme-color); opacity: 0;
  animation: ring-pulse 2s infinite;
}
.nf-toast {
  background: #18181b; border: 1px solid rgba(16,185,129,0.3); border-radius: 12px;
  padding: 12px 20px; display: flex; align-items: center; gap: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  animation: toast-up 4s infinite cubic-bezier(0.16, 1, 0.3, 1);
}
.nf-toast-icon {
  width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; font-weight: bold;
}
.nf-toast-text { color: #e4e4e7; font-size: 0.95rem; font-weight: 500; }

@keyframes bell-shake {
  0%, 80%, 100% { transform: rotate(0); }
  85% { transform: rotate(15deg); }
  90% { transform: rotate(-15deg); }
  95% { transform: rotate(10deg); }
}
@keyframes ring-pulse {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}
@keyframes toast-up {
  0%, 10% { opacity: 0; transform: translateY(30px); }
  20%, 80% { opacity: 1; transform: translateY(0); }
  90%, 100% { opacity: 0; transform: translateY(-30px); }
}

/* Light Theme overrides */
.landing.light-theme .svc-tab-item { color: #475569; border-color: rgba(0,0,0,0.05); }
.landing.light-theme .svc-tab-item.active { background: #ffffff; color: #0f172a; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
.landing.light-theme .svc-tabs-content { background: #ffffff; border-color: rgba(0,0,0,0.05); box-shadow: 0 20px 40px rgba(0,0,0,0.02); }
.landing.light-theme .svc-pane-title { color: #0f172a; }
.landing.light-theme .svc-pane-features li { color: #475569; }
.landing.light-theme .svc-mockup-area { background: #f8fafc; border-color: rgba(0,0,0,0.05);   border-radius: 0 !important;
}

/* Responsive */
@media (max-width: 900px) {
  .services-tabs-container { flex-direction: column; }
  .svc-tabs-list { width: 100%; flex-direction: row; flex-wrap: wrap; }
  .svc-tab-item { flex: 1 1 45%; }
  .svc-tabs-content { padding: 2rem; }
  .svc-pane-features { grid-template-columns: 1fr; }
  .mockup-task { transform: scale(0.8); }
}


/* NEW HERO STATS REDESIGN */
.hero-stats-new {
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-top: 1rem;
}
.stat-pill {
  display: flex; align-items: center; gap: 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 100px;
  padding: 8px 24px 8px 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: left;
}
.stat-pill:hover {
  transform: translateY(-4px);
  background: rgba(255,255,255,0.06);
  border-color: rgba(99,102,241,0.3);
  box-shadow: 0 10px 30px rgba(99,102,241,0.1);
}
.stat-icon {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
}
.stat-val { font-size: 1.1rem; font-weight: 800; color: white; line-height: 1; margin-bottom: 2px; }
.stat-desc { font-size: 0.7rem; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px; }

/* Light Theme overrides for Hero Stats */
.landing.light-theme .stat-pill {
  background: #ffffff !important;
  border-color: rgba(0,0,0,0.08) !important;
  box-shadow: 0 10px 20px rgba(0,0,0,0.03) !important;
}
.landing.light-theme .stat-val { color: #0f172a !important; background: transparent !important; }
.landing.light-theme .stat-desc { color: #64748b !important; }
.landing.light-theme .stat-icon { background: #f8fafc !important; }


/* Fix IntersectionObserver and Scrolling bugs */
html, body {
  overflow-x: clip !important;
}

</style>

<style>
/* ── MOCKUP UI CSS ── */

/* PREMIUM CSS MOCKUPS 2026 */
.mk-premium {
  width: 100%; max-width: 420px; background: rgba(20,20,25,0.4);
  border-radius: 0 !important; border: 1px solid rgba(255,255,255,0.08);
  overflow: hidden; display: flex; flex-direction: column;
  box-shadow: 0 24px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.mk-header {
  padding: 12px 16px; background: rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.mk-dots { display: flex; gap: 6px; }
.mk-dots span { width: 10px; height: 10px; border-radius: 50%; box-shadow: inset 0 1px 2px rgba(255,255,255,0.3); }
.mk-dot-r { background: #ff5f56; } .mk-dot-y { background: #ffbd2e; } .mk-dot-g { background: #27c93f; }
.mk-title { font-size: 0.75rem; color: #a1a1aa; font-weight: 500; font-family: 'Inter', sans-serif; letter-spacing: 0.5px; }

.mk-body { padding: 16px; }
.mk-flex { display: flex; gap: 16px; }
.mk-glass {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
.mk-sidebar { width: 30%; padding: 12px; display: flex; flex-direction: column; gap: 10px; }
.mk-sb-item { height: 8px; border-radius: 4px; background: rgba(255,255,255,0.1); width: 100%; transition: 0.3s; }
.mk-sb-item.mk-active { background: linear-gradient(90deg, #6366f1, #8b5cf6); box-shadow: 0 0 10px rgba(99,102,241,0.5); }
.mk-content { width: 70%; display: flex; flex-direction: column; }
.mk-card { padding: 16px; }
.mk-gradient-text { background: linear-gradient(135deg, #6366f1, #8b5cf6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.mk-progress-bar { width: 100%; height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; overflow: hidden; }
.mk-progress-fill { height: 100%; border-radius: 4px; box-shadow: 0 0 10px rgba(99,102,241,0.5); }

.mk-kanban { display: flex; gap: 12px; }
.mk-col { flex: 1; display: flex; flex-direction: column; gap: 10px; }
.mk-col-title { font-size: 0.75rem; color: #a1a1aa; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }
.mk-task-card { padding: 12px; display: flex; flex-direction: column; gap: 8px; cursor: grab; transition: transform 0.2s, box-shadow 0.2s; }
.mk-task-card:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.4); }
.mk-drag { transform: scale(1.05) rotate(2deg); box-shadow: 0 15px 30px rgba(139,92,246,0.3); border-color: rgba(139,92,246,0.5); }
.mk-badge { font-size: 0.6rem; padding: 2px 6px; border-radius: 4px; font-weight: 600; display: inline-block; width: fit-content; text-transform: uppercase; }
.mk-badge-blue { background: rgba(59,130,246,0.2); color: #60a5fa; border: 1px solid rgba(59,130,246,0.4); }
.mk-badge-red { background: rgba(239,68,68,0.2); color: #f87171; border: 1px solid rgba(239,68,68,0.4); }
.mk-badge-purple { background: rgba(139,92,246,0.2); color: #a78bfa; border: 1px solid rgba(139,92,246,0.4); }
.mk-task-line { height: 6px; background: rgba(255,255,255,0.1); border-radius: 4px; }

.mk-chat { display: flex; flex-direction: column; gap: 12px; position: relative; }
.mk-bubble { padding: 10px 14px; border-radius: 18px; font-size: 0.8rem; max-width: 80%; line-height: 1.4; color: #e4e4e7; font-family: 'Inter', sans-serif; }
.mk-left { align-self: flex-start; border-bottom-left-radius: 4px; }
.mk-right { align-self: flex-end; border-bottom-right-radius: 4px; }
.mk-gradient-bg { background: linear-gradient(135deg, #6366f1, #8b5cf6); box-shadow: 0 4px 15px rgba(99,102,241,0.4); border: none; }
.mk-toast { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%) translateY(50%); padding: 10px 16px; border-radius: 30px; font-size: 0.75rem; white-space: nowrap; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid rgba(255,189,46,0.3); background: rgba(30,25,10,0.8); }
.mk-highlight { color: #ffbd2e; font-weight: 600; }

.mk-settings { display: flex; flex-direction: column; gap: 12px; }
.mk-setting-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 16px; }
.mk-setting-title { font-size: 0.85rem; color: #fff; font-weight: 500; margin-bottom: 2px; font-family: 'Inter', sans-serif; }
.mk-setting-desc { font-size: 0.7rem; color: #a1a1aa; font-family: 'Inter', sans-serif; }
.mk-toggle { width: 44px; height: 24px; background: rgba(255,255,255,0.1); border-radius: 12px; position: relative; cursor: pointer; transition: 0.3s; border: 1px solid rgba(255,255,255,0.05); }
.mk-toggle-circle { width: 18px; height: 18px; background: #fff; border-radius: 50%; position: absolute; top: 2px; left: 3px; transition: 0.3s; box-shadow: 0 2px 5px rgba(0,0,0,0.3); }
.mk-toggle-on { background: #10b981; border-color: #10b981; box-shadow: 0 0 10px rgba(16,185,129,0.4); }
.mk-toggle-on .mk-toggle-circle { left: 21px; }

/* RE-APPLY STACKING FIX FOR PREVIOUS OLD CSS */
.features-stack { padding-bottom: 20vh; }
.stack-container { display: flex; flex-direction: column; gap: 20px; width: 100%; max-width: 1100px; margin: 40px auto 0; position: relative; }
.stack-card { position: sticky; height: 65vh; display: flex; align-items: center; justify-content: center; transform-origin: top center; transition: transform 0.1s ease-out; }
.card-inner { width: 100%; height: 100%; max-height: 550px; border-radius: 0 !important; border: 1px solid rgba(255, 255, 255, 0.1); display: flex; flex-direction: row; overflow: hidden; box-shadow: 0 -10px 40px rgba(0,0,0,0.5); }
.card-content { width: 45%; padding: 40px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
.card-image-wrap { width: 55%; height: 100%; padding: 20px; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.2); }


/* HORIZONTAL SCROLL SECTION */
.horizontal-scroll-section {
  height: 400vh; /* 4 panels * 100vh */
  position: relative;
  width: 100%;
  margin-top: 50px;
}
.sticky-wrapper {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.horizontal-header {
  position: absolute;
  top: 15vh;
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 10;
  pointer-events: none;
}
.horizontal-track {
  display: flex;
  width: 400vw;
  height: 100%;
  will-change: transform;
  align-items: center;
}
.horizontal-panel {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 5vw;
}
.svc-pane-content {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 40px;
  padding: 50px;
  display: flex;
  gap: 50px;
  box-shadow: 0 40px 100px rgba(0,0,0,0.5);
  align-items: center;
  border-radius: 0 !important;
}
.svc-pane-text { flex: 1; text-align: left; }
.svc-pane-visual { flex: 1; }
.svc-pane-icon { 
  width: 60px; height: 60px; 
  border-radius: 20px; 
  background: var(--theme-color); 
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 24px;
}
.svc-pane-title { font-size: 2.2rem; font-weight: 800; color: #fff; margin-bottom: 16px; }
.svc-pane-desc { font-size: 1.1rem; color: #a1a1aa; line-height: 1.6; margin-bottom: 30px; }
.svc-pane-features { list-style: none; padding: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.svc-pane-features li { display: flex; align-items: center; gap: 10px; color: #e4e4e7; font-size: 0.95rem; }
.svc-pane-features svg { color: var(--theme-color); }
.svc-mockup-area { 
  background: #09090b; 
  border: 1px solid rgba(255,255,255,0.08); 
  border-radius: 24px; 
  padding: 30px; 
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 50px rgba(var(--theme-color-rgb), 0.1);
  border-radius: 0 !important;
}
@media (max-width: 900px) {
  .svc-pane-content { flex-direction: column; padding: 30px;   border-radius: 0 !important;
}
  .horizontal-header { top: 5vh; }
  .horizontal-scroll-section { height: 400vh; }
  .svc-pane-features { grid-template-columns: 1fr; }
  .svc-mockup-area { height: 300px;   border-radius: 0 !important;
}
}

/* END HORIZONTAL SCROLL SECTION */


/* TRANSITION FOR STACKING CARDS */
.card-inner {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), filter 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
}




/* TWEAKS FOR SPACING AND SIZE */
.sticky-wrapper {
  justify-content: flex-start !important;
  padding-top: 12vh !important;
}
.ms-header {
  position: static !important;
  margin-bottom: 2vh !important;
}
.horizontal-track {
  margin-top: 0 !important;
  align-items: center !important;
}

.svc-pane-content {
  will-change: transform, opacity, filter;
  max-width: 900px;
  border-radius: 0 !important;
}


/* FEEDBACK 2 TWEAKS */

/* FEEDBACK 2 TWEAKS */
.stack-card {
  border-radius: 0 !important;
}
.how-graphic-item {
  width: 95% !important;
  max-width: 550px !important;
}

/* HOW IT WORKS SCROLL ANIMATION */
.how-scroll-wrapper {
  height: 400vh; /* 3 steps = 300vh + 100vh base */
  position: relative;
  background: #0f172a;
}
.how-sticky-container {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding-top: 10vh;
}
.how-sticky-title {
  text-align: center;
  margin-bottom: 5vh;
}
.how-split {
  display: flex;
  flex: 1;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
}
.how-left {
  flex: 1;
  position: relative;
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 40px;
}
.how-step-card {
  position: absolute;
  top: 50%;
  left: 40px;
  right: 40px;
  margin-top: -80px; /* half height approx */
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 30px;
  display: flex;
  align-items: flex-start;
  gap: 20px;
  will-change: transform, opacity, filter;
  opacity: 0;
}
.how-step-card .step-v-title { color: #fff; font-size: 1.5rem; margin-bottom: 10px; }
.how-step-card .step-v-desc { color: rgba(255,255,255,0.7); line-height: 1.6; }

.how-right {
  flex: 1;
  position: relative;
  height: 60vh;
  perspective: 1000px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.how-graphic-item {
  position: absolute;
  width: 80%;
  max-width: 400px;
  will-change: transform, opacity;
  opacity: 0;
}
.glass-panel {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  overflow: hidden;
}
.mockup-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 15px 20px;
  background: rgba(0,0,0,0.3);
  border-bottom: 1px solid rgba(255,255,255,0.05);
}
.mockup-title { font-size: 12px; color: rgba(255,255,255,0.5); margin-left: 10px; }
.dot { width: 10px; height: 10px; border-radius: 50%; }
.dot.red { background: #ef4444; } .dot.yellow { background: #f59e0b; } .dot.green { background: #10b981; }
.mockup-body { padding: 30px; display: flex; flex-direction: column; gap: 15px; }
.mockup-body.align-center { align-items: center; }
.mockup-body.row-layout { flex-direction: row; align-items: stretch; gap: 15px; }

.fake-input { width: 100%; height: 40px; border-radius: 8px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.3); display: flex; align-items: center; padding: 0 15px; font-size: 14px; }
.fake-btn { width: 100%; height: 40px; border-radius: 8px; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; cursor: pointer; }
.fake-project-card { background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; display: flex; flex-direction: column; gap: 15px; }
.fpc-title { color: #fff; font-weight: 600; }
.fpc-avatars { display: flex; gap: 5px; }
.fpc-avatar { width: 24px; height: 24px; border-radius: 50%; }

.kanban-col { flex: 1; background: rgba(0,0,0,0.3); border-radius: 12px; padding: 15px; display: flex; flex-direction: column; gap: 10px; }
.k-title { font-size: 12px; color: rgba(255,255,255,0.5); font-weight: bold; }
.k-card { height: 60px; background: rgba(255,255,255,0.05); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }

@media (max-width: 768px) {
  .how-split { flex-direction: column; }
  .how-left, .how-right { height: 40vh; padding: 0 20px; width: 100%; }
  .how-step-card { position: static; margin-top: 0; opacity: 1; transform: none !important; filter: none !important; display: none; }
  .how-step-card.active-mobile { display: flex; } /* fallback for mobile */
  .how-scroll-wrapper { height: auto; padding-bottom: 50px; }
  .how-sticky-container { position: static; height: auto; overflow: visible; }
  .how-graphic-item { position: relative; opacity: 1; transform: none !important; width: 100%; display: none; }
  .how-graphic-item.active-mobile { display: block; }
}

/* MICROSERVICES TWEAKS */

.horizontal-panel {
  border: none !important;
  border-radius: 0 !important;
}
.svc-pane-icon {
  display: none !important;
}

/* APPLE-STYLE HORIZONTAL SCROLL */
.horizontal-scroll-section {
  height: 400vh; /* 4 panels */
  position: relative;
  width: 100%;
}
.sticky-wrapper {
  position: sticky;
  top: 0;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.ms-header {
  text-align: center;
  position: absolute;
  top: 12vh;
  left: 0;
  width: 100%;
  z-index: 10;
}
.horizontal-track {
  display: flex;
  width: 400vw;
  height: 100%;
  will-change: transform;
  align-items: center;
  margin-top: 25vh; /* space for header */
}
.horizontal-panel {
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 5vw;
}

@media (max-width: 900px) {
  .horizontal-track { margin-top: 20vh; }
}

/* Fix missing card-inner transition for non-scroll states */
.card-inner {
  will-change: transform, filter, opacity;
  /* Removed CSS transition because it fights with scroll-based instant updates */
}

/* MICROSERVICES HORIZONTAL SNAP SCROLL */
.ms-section { display: none;
  width: 100%;
  padding: 100px 0;
  position: relative;
  z-index: 10;
}
.ms-header {
  text-align: center;
  margin-bottom: 60px;
}
.ms-horizontal-container { display: none;
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  gap: 40px;
  padding: 0 5vw 50px 5vw;
  scrollbar-width: none; /* Firefox */
}
.ms-horizontal-container::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}
.ms-panel {
  flex: 0 0 90vw;
  max-width: 1100px;
  scroll-snap-align: center;
  display: flex;
  justify-content: center;
}
.svc-pane-content {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 0 !important;
  padding: 50px;
  display: flex;
  gap: 50px;
  width: 100%;
  box-shadow: 0 40px 100px rgba(0,0,0,0.4);
  align-items: center;
  position: relative;
  overflow: hidden;
  border-radius: 0 !important;
}
.svc-pane-content::before {
  content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 5px;
  background: var(--theme-color);
  box-shadow: 0 0 20px var(--theme-color);
}
.svc-title-row {
  display: flex; align-items: center; gap: 16px; margin-bottom: 20px;
}
.svc-pane-title { margin: 0; font-size: 2.2rem; font-weight: 800; color: #fff; }
.svc-port-badge {
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2);
  padding: 4px 12px; border-radius: 100px; font-size: 0.85rem; font-family: monospace; color: var(--theme-color);
}

/* PREMIUM MOCKUPS */
.svc-mockup-area {
  background: #09090b;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  padding: 30px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 0 50px rgba(0,0,0,0.5);
  position: relative;
  overflow: hidden;
  border-radius: 0 !important;
}

/* API Mockup */
.ms-mockup-api { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 20px; }
.ms-client-box { background: #1e293b; padding: 12px 24px; border-radius: 12px; border: 1px solid #334155; font-weight: bold; }
.ms-api-beams { display: flex; gap: 40px; height: 60px; position: relative; width: 200px; justify-content: center;}
.ms-beam { width: 2px; height: 100%; background: linear-gradient(to bottom, transparent, var(--theme-color), transparent); animation: beamSlide 1.5s infinite linear; opacity: 0; }
.ms-beam.delay-1 { animation-delay: 0.5s; }
.ms-beam.delay-2 { animation-delay: 1s; }
@keyframes beamSlide { 0% { transform: translateY(-100%); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(100%); opacity: 0; } }
.ms-gateway-box { background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2)); border: 1px solid rgba(99,102,241,0.5); padding: 20px 40px; border-radius: 0 !important; text-align: center; position: relative; box-shadow: 0 0 30px rgba(99,102,241,0.2); }
.ms-shield-icon { font-size: 24px; margin-bottom: 8px; }
.ms-jwt-badge { position: absolute; top: -12px; right: -20px; background: #10b981; color: #000; font-size: 0.7rem; padding: 4px 8px; border-radius: 100px; font-weight: bold; animation: pulseBadge 2s infinite; }
@keyframes pulseBadge { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); box-shadow: 0 0 15px #10b981; } }
.ms-microservices-grid { display: flex; gap: 20px; margin-top: 20px; }
.ms-micro-box { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-top: 3px solid var(--c); padding: 15px 20px; border-radius: 12px; font-size: 0.9rem; font-weight: 600; color: #cbd5e1; }

/* Project Mockup */
.ms-mockup-project { width: 100%; }
.ms-window { background: #0f172a; border-radius: 0 !important; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
.ms-win-header { background: #1e293b; padding: 12px 16px; display: flex; align-items: center; gap: 16px; }
.ms-win-dots span { display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #ef4444; margin-right: 6px; }
.ms-win-dots span:nth-child(2) { background: #f59e0b; }
.ms-win-dots span:nth-child(3) { background: #10b981; margin: 0; }
.ms-win-title { font-size: 0.85rem; color: #94a3b8; font-family: monospace; }
.ms-win-body { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
.ms-proj-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; transition: 0.3s; }
.ms-proj-card:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.1); }
.ms-proj-top { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.ms-proj-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #fff; font-size: 0.9rem; }
.ms-proj-name { flex: 1; font-weight: 600; color: #e2e8f0; }
.ms-proj-badge { background: rgba(99,102,241,0.1); color: #818cf8; font-size: 0.75rem; padding: 4px 10px; border-radius: 100px; font-weight: 600; }
.ms-proj-bar { height: 6px; background: rgba(255,255,255,0.1); border-radius: 100px; overflow: hidden; }
.ms-proj-fill { height: 100%; border-radius: 100px; animation: loadBar 1.5s ease-out forwards; transform-origin: left; }
@keyframes loadBar { 0% { transform: scaleX(0); } 100% { transform: scaleX(1); } }

/* Task Mockup */
.ms-mockup-task { width: 100%; height: 100%; }
.ms-kanban { display: flex; gap: 16px; height: 100%; }
.ms-kb-col { flex: 1; background: rgba(255,255,255,0.02); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 12px; border: 1px dashed rgba(255,255,255,0.05); }
.ms-kb-title { font-size: 0.85rem; font-weight: 700; color: #94a3b8; display: flex; justify-content: space-between; margin-bottom: 10px; }
.ms-kb-title span { background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 100px; }
.ms-kb-card { background: #1e293b; height: 60px; border-radius: 8px; border: 1px solid #334155; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
.ms-kb-card.done { opacity: 0.5; height: 40px; }
.kb-anim-drag { animation: kbDrag 4s infinite cubic-bezier(0.25, 1, 0.5, 1); position: relative; z-index: 10; border-color: #ef4444; box-shadow: 0 10px 20px rgba(239,68,68,0.2); }
@keyframes kbDrag { 0%, 100% { transform: translate(0, 0) rotate(0deg); } 50% { transform: translate(-150px, -20px) rotate(-5deg); } }

/* Notify Mockup */
.ms-mockup-notify { width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 40px; }
.ms-bell-container { position: relative; }
.ms-bell-icon { animation: bellShake 3s infinite; transform-origin: top center; }
.ms-bell-badge { position: absolute; top: 0; right: 0; background: #ef4444; color: #fff; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold; border: 2px solid #09090b; }
.ms-bell-ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 64px; height: 64px; border-radius: 50%; border: 2px solid #10b981; animation: ringPulse 2s infinite cubic-bezier(0.16, 1, 0.3, 1); opacity: 0; }
.ms-bell-ring.delay-1 { animation-delay: 1s; }
@keyframes bellShake { 0%, 10%, 100% { transform: rotate(0); } 2% { transform: rotate(15deg); } 4% { transform: rotate(-15deg); } 6% { transform: rotate(10deg); } 8% { transform: rotate(-10deg); } }
@keyframes ringPulse { 0% { width: 64px; height: 64px; opacity: 1; } 100% { width: 150px; height: 150px; opacity: 0; } }
.ms-toast-popup { background: #1e293b; border-left: 4px solid #10b981; padding: 16px 20px; border-radius: 8px; display: flex; align-items: center; gap: 16px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); animation: toastSlide 4s infinite cubic-bezier(0.16, 1, 0.3, 1); opacity: 0; transform: translateY(20px); }
.ms-toast-icon { width: 30px; height: 30px; background: rgba(16,185,129,0.2); color: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; }
.ms-toast-text { color: #e2e8f0; font-size: 0.95rem; }
.ms-toast-text span { display: block; font-size: 0.75rem; color: #64748b; margin-top: 4px; }
@keyframes toastSlide { 0%, 100% { opacity: 0; transform: translateY(20px); } 15%, 85% { opacity: 1; transform: translateY(0); } }

/* REMOVE OLD BUGGY CSS IF IT EXISTS */


/* SAAS EXTRAS */
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-100%); } }
.title-text { color: #e4e4e7; }
.sub-text { color: #a1a1aa; }


/* LIGHT THEME OVERRIDES */
.landing.light-theme {
  background: #f8fafc;
  color: #0f172a;
}
.landing.light-theme .nav {
  background: rgba(248, 250, 252, 0.8);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.landing.light-theme .logo-text,
.landing.light-theme .nav-link,
.landing.light-theme .btn-nav-login,
.landing.light-theme .hero-title,
.landing.light-theme .title-text,
.landing.light-theme .feat-title,
.landing.light-theme .step-title,
.landing.light-theme .section-title,
.landing.light-theme .svc-name,
.landing.light-theme .stat-val {
  color: #0f172a !important;
}

.landing.light-theme .hero-desc,
.landing.light-theme .sub-text,
.landing.light-theme .feat-desc,
.landing.light-theme .feat-list li,
.landing.light-theme .step-desc,
.landing.light-theme .section-sub,
.landing.light-theme .svc-port,
.landing.light-theme .svc-features li,
.landing.light-theme .marquee-item,
.landing.light-theme .stat-label {
  color: #475569 !important;
}

.landing.light-theme .section-badge {
  background: rgba(0,0,0,0.05) !important;
  color: #475569 !important;
  border-color: rgba(0,0,0,0.1) !important;
}

.landing.light-theme .step-num {
  color: rgba(0,0,0,0.05) !important;
}

.landing.light-theme .theme-toggle {
  background: rgba(0,0,0,0.05) !important;
  color: #0f172a !important;
}
.landing.light-theme .hero-mockup {
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
}
.landing.light-theme .hm-sidebar { background: #f1f5f9; border-right-color: rgba(0,0,0,0.05); }
.landing.light-theme .card-inner {
  background: #ffffff !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05) !important;
}
.landing.light-theme .card-image-wrap {
  background: #f8fafc !important;
}
.landing.light-theme .mk-premium {
  background: #ffffff;
  border-color: rgba(0, 0, 0, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05);
}
.landing.light-theme .mk-header { background: #f1f5f9; border-bottom-color: rgba(0,0,0,0.05); }
.landing.light-theme .mk-glass {
  background: #ffffff !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05) !important;
}
.landing.light-theme .mk-title,
.landing.light-theme .mk-text-sm,
.landing.light-theme .mk-col-title,
.landing.light-theme .mk-setting-desc {
  color: #64748b !important;
}
.landing.light-theme .mk-bubble.mk-left { color: #0f172a !important; }
.landing.light-theme .mk-bubble.mk-right { color: white !important; }
.landing.light-theme .mk-toast {
  background: #ffffff !important;
  color: #0f172a !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
}
.landing.light-theme .mk-setting-title { color: #0f172a !important; }
.landing.light-theme .mk-toggle { border-color: rgba(0,0,0,0.1) !important; background: rgba(0,0,0,0.05) !important; }
.landing.light-theme .mk-task-card { background: #ffffff !important; border: 1px solid rgba(0,0,0,0.1) !important; box-shadow: 0 4px 10px rgba(0,0,0,0.02) !important; }

.landing.light-theme .testimonial-card,
.landing.light-theme .p-card {
  background: #ffffff !important;
  border-color: rgba(0, 0, 0, 0.1) !important;
}
.landing.light-theme .p-card .btn-outline {
  border-color: rgba(0, 0, 0, 0.2) !important;
  color: #0f172a !important;
}
.landing.light-theme .pricing-section { background: #f8fafc !important; border-top-color: rgba(0,0,0,0.05) !important; }
.landing.light-theme .testimonials-section { border-top-color: rgba(0,0,0,0.05) !important; }
.landing.light-theme .cta-section { background: #f8fafc !important; }
/* Removed ugly cta-inner box */
.landing.light-theme .cta-title { color: #0f172a !important; }
.landing.light-theme .cta-sub { color: #475569 !important; }
.landing.light-theme .footer { border-top-color: rgba(0,0,0,0.05) !important; }
.landing.light-theme .footer-text { color: #64748b !important; }
.landing.light-theme .stats-section { background: #f8fafc !important; }
.landing.light-theme .service-card { background: #ffffff !important; border: 1px solid rgba(0,0,0,0.1) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.05) !important; }

.landing.light-theme .btn-outline-white {
  color: #0f172a !important;
  border-color: rgba(0, 0, 0, 0.2) !important;
}
.landing.light-theme .btn-outline-white:hover {
  background: rgba(0, 0, 0, 0.05) !important;
}

/* BETTER ANIMATIONS */
.cta-inner {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.5s ease;
}
.cta-inner:hover {
  transform: translateY(-5px) scale(1.01);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.1) !important;
}

.btn-primary.large {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-primary.large:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(99, 102, 241, 0.4);
}

.btn-outline-white {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-outline-white:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
}

/* Floating animation for mockups */
@keyframes float-soft {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.hero-mockup {
  animation: float-soft 6s ease-in-out infinite;
}


/* FOOTER AND NAV FIXES */
.landing.light-theme .footer-logo span { color: #0f172a !important; }
.landing.light-theme .footer-links a { color: #64748b !important; }
.landing.light-theme .footer-links a:hover { color: #6366f1 !important; }
.landing.light-theme .footer-copy { color: #94a3b8 !important; }

.landing.light-theme .nav-lang-dropdown { border-color: rgba(0,0,0,0.1) !important; background: rgba(0,0,0,0.03) !important; }
.landing.light-theme .nav-lang-dropdown .current-lang { color: #0f172a !important; }
.landing.light-theme .nav-lang-dropdown svg { stroke: #0f172a !important; }
.landing.light-theme .lang-menu { background: #ffffff !important; border: 1px solid rgba(0,0,0,0.1) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important; }
.landing.light-theme .lang-item { color: #475569 !important; }
.landing.light-theme .lang-item:hover { background: #f1f5f9 !important; color: #0f172a !important; }
.landing.light-theme .lang-item.active { background: rgba(99, 102, 241, 0.1) !important; color: #6366f1 !important; }


/* ENHANCED CONTINUOUS ANIMATIONS */
@keyframes continuous-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@keyframes continuous-pulse {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
}

.cta-inner {
  animation: continuous-float 6s ease-in-out infinite;
}
.cta-inner:hover {
  animation-play-state: paused;
}

.cta-orb-1, .cta-orb-2 {
  animation: continuous-pulse 8s ease-in-out infinite alternate !important;
}

.hero-mockup {
  animation: continuous-float 7s ease-in-out infinite;
}
.hero-mockup:hover {
  animation-play-state: paused;
}


/* HUD & ADVANCED ANIMATIONS (2026) */
.mk-hud {
  display: flex; justify-content: center; align-items: center; width: 100%; height: 100%;
}
.float-anim {
  animation: hud-float 6s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate;
}
.float-anim-delayed {
  animation: hud-float 6s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate;
  animation-delay: -3s;
}
@keyframes hud-float {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-15px); }
}

/* Fix sticky card inner clipping */
.card-inner {
  max-height: 85vh !important;
  overflow: visible !important;
}

/* Light theme overrides for HUD */
.landing.light-theme .mk-hud .mk-glass {
  background: rgba(255,255,255,0.7) !important;
  border: 1px solid rgba(0,0,0,0.05) !important;
  box-shadow: 0 30px 60px rgba(0,0,0,0.05) !important;
}
.landing.light-theme .mk-hud .mk-setting-title,
.landing.light-theme .mk-hud .mk-bubble.mk-left,
.landing.light-theme .mk-hud .mk-toast {
  color: #0f172a !important;
}
.landing.light-theme .mk-hud .mk-bubble.mk-right {
  color: #ffffff !important; /* Keep gradient text white */
}


/* VERTICAL TIMELINE DESIGN */
.steps-vertical {
  display: flex;
  flex-direction: column;
  gap: 4rem;
  max-width: 700px;
  margin: 40px auto 0;
  position: relative;
  text-align: left;
}
.steps-vertical::before {
  content: '';
  position: absolute;
  top: 40px; bottom: 0;
  left: 40px;
  width: 2px;
  background: linear-gradient(180deg, rgba(99,102,241,0.5) 0%, rgba(236,72,153,0.1) 100%);
  z-index: 0;
}

.step-v {
  display: flex;
  align-items: flex-start;
  gap: 3rem;
  position: relative;
  z-index: 1;
}

.step-v-icon-wrap {
  position: relative;
  flex-shrink: 0;
}

.step-v-icon {
  width: 80px; height: 80px;
  border-radius: 24px;
  display: flex; align-items: center; justify-content: center;
  position: relative;
  z-index: 2;
}

.step-v-num {
  position: absolute;
  top: -12px; right: -12px;
  width: 28px; height: 28px;
  border-radius: 50%;
  background: #ffffff; color: #0f172a;
  font-size: 0.8rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  z-index: 3;
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}

.step-v-content {
  padding-top: 10px;
}
.step-v-title {
  font-size: 1.8rem; font-weight: 800; color: white; margin-bottom: 0.5rem;
}
.step-v-desc {
  font-size: 1.1rem; color: rgba(255,255,255,0.7); line-height: 1.6;
}

/* NEW ADVANCED SLIDE-RIGHT ANIMATION */
.reveal-slide-right {
  opacity: 0;
  transform: translateX(-60px);
  transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
}
.reveal-slide-right.revealed {
  opacity: 1;
  transform: translateX(0);
}

/* Light theme overrides for vertical steps */
.landing.light-theme .step-v-title { color: #0f172a !important; }
.landing.light-theme .step-v-desc { color: #475569 !important; }
.landing.light-theme .step-v-num { background: #0f172a; color: #ffffff; }

/* Responsive */
@media (max-width: 768px) {
  .steps-vertical { gap: 3rem; }
  .steps-vertical::before { left: 30px; }
  .step-v { gap: 1.5rem; }
  .step-v-icon { width: 60px; height: 60px; border-radius: 0 !important; }
  .step-v-title { font-size: 1.4rem; }
  .step-v-desc { font-size: 0.95rem; }
}


/* SERVICES 2x2 GRID UPGRADE */
.services-grid {
  display: grid; 
  grid-template-columns: repeat(2, 1fr) !important; 
  gap: 2.5rem !important;
  text-align: left; 
  margin-top: 4rem;
}

.service-card {
  background: rgba(255,255,255,0.02) !important;
  border: 1px solid rgba(255,255,255,0.05) !important;
  border-radius: 32px !important;
  padding: 2.5rem !important;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) !important;
}

.service-card:hover {
  transform: translateY(-8px) scale(1.02);
  background: rgba(255,255,255,0.04) !important;
  border-color: var(--theme-color) !important;
  box-shadow: 0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1) !important;
}

.svc-name-large {
  font-size: 1.6rem;
  font-weight: 800;
  color: white;
  margin-bottom: 6px;
  letter-spacing: -0.5px;
}
.svc-port-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  font-weight: 600;
}

.svc-features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.svc-features-grid li {
  display: flex;
  align-items: center;
  gap: 10px;
  color: rgba(255,255,255,0.7);
  font-size: 1.05rem;
  transition: color 0.3s;
}
.service-card:hover .svc-features-grid li {
  color: rgba(255,255,255,0.95);
}

/* Light Theme overrides for wide cards */
.landing.light-theme .svc-name-large { color: #0f172a !important; }
.landing.light-theme .svc-features-grid li { color: #475569 !important; }
.landing.light-theme .service-card {
  background: #ffffff !important;
  border-color: rgba(0,0,0,0.1) !important;
  box-shadow: 0 20px 40px rgba(0,0,0,0.03) !important;
}
.landing.light-theme .service-card:hover {
  box-shadow: 0 40px 80px rgba(0,0,0,0.1) !important;
}
.landing.light-theme .svc-icon-wrap {
  background: #f8fafc !important;
  border-color: rgba(0,0,0,0.05) !important;
}

@media (max-width: 900px) {
  .services-grid { grid-template-columns: 1fr !important; }
  .svc-features-grid { grid-template-columns: 1fr; }
}


/* SERVICES TABS & CSS MOCKUPS */
.services-tabs-container {
  display: flex; gap: 2rem;
  margin-top: 4rem;
  text-align: left;
  max-width: 1100px;
  margin-left: auto; margin-right: auto;
}

.svc-tabs-list {
  display: flex; flex-direction: column; gap: 12px;
  width: 300px; flex-shrink: 0;
}

.svc-tab-item {
  display: flex; align-items: center; gap: 16px;
  padding: 20px 24px;
  border-radius: 0 !important;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  color: rgba(255,255,255,0.6);
}

.svc-tab-item:hover {
  background: rgba(255,255,255,0.05);
  color: white;
}

.svc-tab-item.active {
  background: rgba(255,255,255,0.08);
  border-color: var(--theme-color);
  color: white;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.svc-tab-icon {
  width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  transition: color 0.3s;
}

.svc-tab-item.active .svc-tab-icon {
  color: var(--theme-color);
  filter: drop-shadow(0 0 8px var(--theme-color));
}

.svc-tab-name {
  font-size: 1.1rem; font-weight: 600;
}

.svc-tabs-content {
  flex-grow: 1;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 24px;
  padding: 3rem;
  position: relative;
  overflow: hidden;
  display: flex; flex-direction: column;
}

.svc-pane-top {
  margin-bottom: 3rem;
}

.svc-pane-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 2rem;
}

.svc-pane-title {
  font-size: 2.2rem; font-weight: 800; color: white; margin: 0;
}

.svc-port-badge {
  display: inline-block; padding: 6px 16px;
  border-radius: 12px;
  background: rgba(255,255,255,0.05);
  color: var(--theme-color);
  font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; font-weight: 700;
  border: 1px solid var(--theme-color);
}

.svc-pane-features {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;
  list-style: none; padding: 0; margin: 0;
}
.svc-pane-features li {
  display: flex; align-items: center; gap: 12px;
  color: rgba(255,255,255,0.8); font-size: 1.1rem;
}

/* Transitions */
.fade-up-enter-active, .fade-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-up-enter-from { opacity: 0; transform: translateY(20px); }
.fade-up-leave-to { opacity: 0; transform: translateY(-20px); }

/* --- CSS MOCKUPS --- */
.svc-mockup-area {
  height: 250px;
  background: rgba(0,0,0,0.2);
  border-radius: 0 !important;
  border: 1px solid rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
  border-radius: 0 !important;
}

/* Tab 0: API Mockup */
.mockup-api { display: flex; align-items: center; gap: 20px; }
.api-node {
  padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 0.9rem;
  background: #1e1e24; border: 2px solid rgba(255,255,255,0.1); color: white;
  position: relative; z-index: 2;
}
.api-node.gateway {
  border-color: #6366f1; box-shadow: 0 0 20px rgba(99,102,241,0.4);
  padding: 20px 30px; font-size: 1.1rem;
}
.api-node.proj { border-color: #f59e0b; }
.api-node.task { border-color: #ef4444; }
.api-node.noti { border-color: #10b981; }

.api-line, .api-line-out {
  height: 2px; background: rgba(255,255,255,0.1); position: relative;
}
.api-line { width: 50px; }
.api-lines-out { display: flex; flex-direction: column; gap: 28px; justify-content: center; height: 120px; }
.api-line-out { width: 40px; }

.api-dot {
  width: 8px; height: 8px; border-radius: 50%; background: white;
  position: absolute; top: -3px; left: 0;
  box-shadow: 0 0 10px white;
  animation: api-flow 1.5s infinite linear;
}
@keyframes api-flow {
  0% { left: 0; opacity: 1; }
  100% { left: 100%; opacity: 0; }
}
.api-services { display: flex; flex-direction: column; gap: 12px; }

/* Tab 1: Project Mockup */
.mockup-project {
  width: 350px; background: #18181b; border-radius: 0 !important; border: 1px solid rgba(255,255,255,0.05);
  padding: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  animation: float 4s ease-in-out infinite alternate;
}
.pj-header { font-size: 1.1rem; font-weight: 700; color: white; margin-bottom: 16px; }
.pj-list { display: flex; flex-direction: column; gap: 12px; }
.pj-item {
  background: rgba(255,255,255,0.03); padding: 12px; border-radius: 8px;
  animation: slide-right 0.5s cubic-bezier(0.16, 1, 0.3, 1) backwards;
}
.pj-info { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.pj-avatar { width: 24px; height: 24px; border-radius: 6px; }
.pj-name { font-size: 0.9rem; color: #e4e4e7; font-weight: 600; }
.pj-progress { height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; overflow: hidden; }
.pj-fill { height: 100%; animation: fill-bar 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; transform-origin: left; transform: scaleX(0); }
@keyframes fill-bar { to { transform: scaleX(1); } }
@keyframes slide-right { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }

/* Tab 2: Task Mockup */
.mockup-task {
  display: flex; gap: 16px; transform: rotateX(10deg) rotateZ(-5deg); perspective: 1000px;
  transform-style: preserve-3d;
}
.kb-col {
  width: 120px; background: rgba(255,255,255,0.02); border-radius: 12px; padding: 12px;
  border: 1px solid rgba(255,255,255,0.05);
}
.kb-title { font-size: 0.7rem; font-weight: 700; color: #a1a1aa; margin-bottom: 12px; letter-spacing: 1px; }
.kb-card {
  height: 40px; background: #27272a; border-radius: 6px; margin-bottom: 8px;
  border: 1px solid rgba(255,255,255,0.05);
}
.kb-drag {
  border-color: #ef4444; box-shadow: 0 10px 20px rgba(239,68,68,0.3);
  transform: translateZ(20px) rotate(-3deg);
  animation: kb-float 3s infinite alternate;
}
@keyframes kb-float { to { transform: translateZ(30px) rotate(-3deg) translateY(-10px); } }

/* Tab 3: Notify Mockup */
.mockup-notify {
  display: flex; flex-direction: column; align-items: center; gap: 24px;
}
.nf-bell {
  position: relative; animation: bell-shake 4s infinite;
}
.nf-badge {
  position: absolute; top: -5px; right: -5px; width: 20px; height: 20px; border-radius: 50%;
  background: #ef4444; color: white; font-size: 0.7rem; font-weight: bold;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 0 10px rgba(239,68,68,0.5);
}
.nf-ring {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 60px; height: 60px; border-radius: 50%;
  border: 2px solid var(--theme-color); opacity: 0;
  animation: ring-pulse 2s infinite;
}
.nf-toast {
  background: #18181b; border: 1px solid rgba(16,185,129,0.3); border-radius: 12px;
  padding: 12px 20px; display: flex; align-items: center; gap: 12px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  animation: toast-up 4s infinite cubic-bezier(0.16, 1, 0.3, 1);
}
.nf-toast-icon {
  width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 0.8rem; font-weight: bold;
}
.nf-toast-text { color: #e4e4e7; font-size: 0.95rem; font-weight: 500; }

@keyframes bell-shake {
  0%, 80%, 100% { transform: rotate(0); }
  85% { transform: rotate(15deg); }
  90% { transform: rotate(-15deg); }
  95% { transform: rotate(10deg); }
}
@keyframes ring-pulse {
  0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
  100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
}
@keyframes toast-up {
  0%, 10% { opacity: 0; transform: translateY(30px); }
  20%, 80% { opacity: 1; transform: translateY(0); }
  90%, 100% { opacity: 0; transform: translateY(-30px); }
}

/* Light Theme overrides */
.landing.light-theme .svc-tab-item { color: #475569; border-color: rgba(0,0,0,0.05); }
.landing.light-theme .svc-tab-item.active { background: #ffffff; color: #0f172a; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
.landing.light-theme .svc-tabs-content { background: #ffffff; border-color: rgba(0,0,0,0.05); box-shadow: 0 20px 40px rgba(0,0,0,0.02); }
.landing.light-theme .svc-pane-title { color: #0f172a; }
.landing.light-theme .svc-pane-features li { color: #475569; }
.landing.light-theme .svc-mockup-area { background: #f8fafc; border-color: rgba(0,0,0,0.05);   border-radius: 0 !important;
}

/* Responsive */
@media (max-width: 900px) {
  .services-tabs-container { flex-direction: column; }
  .svc-tabs-list { width: 100%; flex-direction: row; flex-wrap: wrap; }
  .svc-tab-item { flex: 1 1 45%; }
  .svc-tabs-content { padding: 2rem; }
  .svc-pane-features { grid-template-columns: 1fr; }
  .mockup-task { transform: scale(0.8); }
}


/* NEW HERO STATS REDESIGN */
.hero-stats-new {
  display: flex; align-items: center; gap: 16px; flex-wrap: wrap; margin-top: 1rem;
}
.stat-pill {
  display: flex; align-items: center; gap: 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 100px;
  padding: 8px 24px 8px 8px;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: left;
}
.stat-pill:hover {
  transform: translateY(-4px);
  background: rgba(255,255,255,0.06);
  border-color: rgba(99,102,241,0.3);
  box-shadow: 0 10px 30px rgba(99,102,241,0.1);
}
.stat-icon {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: center;
}
.stat-val { font-size: 1.1rem; font-weight: 800; color: white; line-height: 1; margin-bottom: 2px; }
.stat-desc { font-size: 0.7rem; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px; }

/* Light Theme overrides for Hero Stats */
.landing.light-theme .stat-pill {
  background: #ffffff !important;
  border-color: rgba(0,0,0,0.08) !important;
  box-shadow: 0 10px 20px rgba(0,0,0,0.03) !important;
}
.landing.light-theme .stat-val { color: #0f172a !important; background: transparent !important; }
.landing.light-theme .stat-desc { color: #64748b !important; }
.landing.light-theme .stat-icon { background: #f8fafc !important; }


/* Fix IntersectionObserver and Scrolling bugs */
html, body {
  overflow-x: clip !important;
}

</style>
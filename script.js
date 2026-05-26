document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Scroll Animation (スクロールフェードインアニメーション)
     ========================================================================== */
  const animatedElements = document.querySelectorAll('.fade-in-up');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px',
      threshold: 0.15 // 15%見えたらトリガー
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // 一度アニメーションしたら監視解除してパフォーマンス向上
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // 互換性フォールバック（IntersectionObserverが使えない古いブラウザ用）
    animatedElements.forEach(element => {
      element.classList.add('is-visible');
    });
  }

  /* ==========================================================================
     2. FAQ Accordion (よくある質問 アコーディオン)
     ========================================================================== */
  const faqHeaders = document.querySelectorAll('.faq-header');
  
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const faqItem = header.parentElement;
      const faqContent = header.nextElementSibling;
      const isActive = faqItem.classList.contains('active');
      
      // 他のFAQ項目を閉じる (クリーンなアコーディオンの挙動)
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
          item.classList.remove('active');
          item.querySelector('.faq-content').style.maxHeight = null;
        }
      });
      
      if (!isActive) {
        faqItem.classList.add('active');
        // scrollHeightから高さを計算して滑らかなCSSトランジションを実行
        faqContent.style.maxHeight = faqContent.scrollHeight + "px";
      } else {
        faqItem.classList.remove('active');
        faqContent.style.maxHeight = null;
      }
    });
  });

  /* ==========================================================================
     3. Smooth Anchor Scroll with Header Offset (固定ヘッダー考慮のスムーススクロール)
     ========================================================================== */
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  const siteHeader = document.getElementById('site-header');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // ヘッダーの高さを取得してオフセット計算
        const headerHeight = siteHeader ? siteHeader.offsetHeight : 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* ==========================================================================
     4. Mobile Hamburger Menu Toggle (モバイルハンバーガーメニュー開閉)
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('header-nav');
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  if (hamburgerBtn && navMenu) {
    // トグル動作
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    
    // リンククリック時にドロワーを閉じる
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
    
    // メニュー外クリック時に閉じる
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     5. Scroll to Top / Auto Header Class (スクロール時のヘッダー質感変化)
     ========================================================================== */
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      siteHeader.style.boxShadow = '0 10px 30px -10px rgba(15, 23, 42, 0.08)';
      siteHeader.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    } else {
      siteHeader.style.boxShadow = 'none';
      siteHeader.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    }
  });

  /* ==========================================================================
     6. Hero Background Slideshow (ヒーロー背景画像スライドショー)
     ========================================================================== */
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1) {
    let currentSlide = 0;
    const slideInterval = 6000; // 6秒ごとに次の画像へフェード切り替え

    setInterval(() => {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % slides.length;
      slides[currentSlide].classList.add('active');
    }, slideInterval);
  }

  /* ==========================================================================
     7. Flow Timeline Scroll Animation (FLOWセクション進行状況アニメーション)
     ========================================================================== */
  const processSteps = document.querySelectorAll('.process-step');
  const processGrid = document.querySelector('.process-grid');
  const progressLine = document.querySelector('.process-grid-progress');
  
  if (processSteps.length > 0 && 'IntersectionObserver' in window) {
    const stepObserverOptions = {
      root: null,
      rootMargin: '-30% 0px -30% 0px', // 画面中央付近（上部30%・下部30%を除外したエリア）で判定
      threshold: 0.1
    };

    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          // 下方向に戻った（スクロールで画面の下側に外れた）場合は active を外す
          if (entry.boundingClientRect.top > 0) {
            entry.target.classList.remove('active');
          }
        }
      });
    }, stepObserverOptions);

    processSteps.forEach(step => {
      stepObserver.observe(step);
    });
  }

  // タイムラインの縦ラインをスクロール量に合わせて無段階で伸ばす処理
  if (processGrid && progressLine) {
    const updateProgressLine = () => {
      const rect = processGrid.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // タイムラインエリアが画面内に入っている場合のみ実行
      if (rect.top < windowHeight && rect.bottom > 0) {
        // 画面上部25%から下部75%の範囲をトリガーとして計算
        const startTrigger = windowHeight * 0.75;
        
        const totalDistance = rect.height;
        const currentScrolled = startTrigger - rect.top;
        
        // 最後のステップが画面上部付近に到達した時に100%になるよう調整
        let progress = (currentScrolled / (totalDistance - (windowHeight * 0.4))) * 100;
        progress = Math.max(0, Math.min(100, progress)); // 0%〜100%に制限
        
        progressLine.style.height = `${progress}%`;
      }
    };
    
    window.addEventListener('scroll', updateProgressLine);
    window.addEventListener('resize', updateProgressLine);
    updateProgressLine(); // 初回表示時にも適用
  }
});

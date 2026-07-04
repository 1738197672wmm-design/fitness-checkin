import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })

  const title = document.querySelector('.hero-title')
  if (title) {
    tl.fromTo(title, 
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: 1.2 },
      0.3
    )
  }

  const stats = document.querySelector('.hero-stats-inline')
  if (stats) {
    tl.fromTo(stats, 
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 },
      0.8
    )
  }

  const cta = document.querySelector('.hero-cta')
  if (cta && cta.children.length) {
    tl.fromTo(cta.children, 
      { y: 40, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.15 },
      1.1
    )
  }

  const desc = document.querySelector('.hero-desc')
  if (desc) {
    tl.fromTo(desc, 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      1.4
    )
  }

  const cards = document.querySelectorAll('.visual-card')
  if (cards.length) {
    tl.fromTo(cards, 
      { x: 80, opacity: 0, scale: 0.9 },
      { x: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.12, ease: 'power3.out' },
      0.6
    )
  }

  const scroll = document.querySelector('.hero-scroll-indicator')
  if (scroll) {
    tl.fromTo(scroll, 
      { opacity: 0 },
      { opacity: 0.5, duration: 0.8 },
      2
    )
  }

  return tl
}

export function animateSection(sectionSel, titleSel, cardSel) {
  const section = document.querySelector(sectionSel)
  if (!section) return null

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 80%',
      end: 'top 30%',
      toggleActions: 'play none none reverse'
    }
  })

  const title = section.querySelector(titleSel)
  if (title) {
    tl.fromTo(title, 
      { y: 80, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1, ease: 'power3.inOut' },
      0
    )
  }

  const desc = section.querySelector('.section-desc')
  if (desc) {
    tl.fromTo(desc, 
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      0.3
    )
  }

  const cards = section.querySelectorAll(cardSel)
  if (cards.length) {
    tl.fromTo(cards, 
      { y: 60, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.08, ease: 'power3.out' },
      0.4
    )
  }

  return tl
}

export function animateImageReveal(imageSel) {
  const images = document.querySelectorAll(imageSel)
  images.forEach(img => {
    const parent = img.closest('.featured-card, .exercise-card, .featured-image')
    if (!parent) return

    gsap.fromTo(parent, 
      { clipPath: 'inset(0 0 100% 0)' },
      { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power3.inOut',
        scrollTrigger: { trigger: parent, start: 'top 85%', toggleActions: 'play none none reverse' }
      }
    )

    const innerImg = parent.querySelector('img')
    if (innerImg) {
      gsap.to(innerImg, {
        yPercent: -15, ease: 'none',
        scrollTrigger: { trigger: parent, start: 'top bottom', end: 'bottom top', scrub: 1 }
      })
    }
  })
}

export function animateSectionLabel(labelSel) {
  const labels = document.querySelectorAll(labelSel)
  labels.forEach(label => {
    gsap.fromTo(label, 
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: label, start: 'top 90%', toggleActions: 'play none none reverse' }
      }
    )
  })
}

export function animateContactCard() {
  const card = document.querySelector('.contact-card')
  if (!card) return
  gsap.fromTo(card, 
    { scale: 0.9, opacity: 0 },
    { scale: 1, opacity: 1, duration: 1, ease: 'power3.inOut',
      scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' }
    }
  )
}

export function animateLeaderboard() {
  const items = document.querySelectorAll('.podium-item')
  if (items.length) {
    gsap.fromTo(items, 
      { y: 100, opacity: 0, scale: 0.8 },
      { y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.2, ease: 'elastic.out(1, 0.6)',
        scrollTrigger: { trigger: '.leaderboard-podium', start: 'top 80%', toggleActions: 'play none none reverse' }
      }
    )
  }
  const listItems = document.querySelectorAll('.list-item')
  if (listItems.length) {
    gsap.fromTo(listItems, 
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.7, stagger: 0.05, ease: 'power3.out',
        scrollTrigger: { trigger: '.leaderboard-list', start: 'top 85%', toggleActions: 'play none none reverse' }
      }
    )
  }
}

export function animateTodayCards() {
  const cards = document.querySelectorAll('.today-card')
  if (cards.length) {
    gsap.fromTo(cards, 
      { y: 50, opacity: 0, rotateX: -15 },
      { y: 0, opacity: 1, rotateX: 0, duration: 0.9, stagger: 0.12, ease: 'power3.inOut',
        scrollTrigger: { trigger: '.dashboard-today', start: 'top 85%', toggleActions: 'play none none reverse' }
      }
    )
  }
}

export function animateWelcome() {
  const avatar = document.querySelector('.welcome-avatar')
  if (avatar) {
    gsap.fromTo(avatar, 
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1.2, ease: 'back.out(1.7)' },
      0.2
    )
  }
  const title = document.querySelector('.welcome-title')
  if (title) {
    gsap.fromTo(title, 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
      0.5
    )
  }
}

export function cleanupScrollTriggers() {
  ScrollTrigger.getAll().forEach(st => st.kill())
}

export function initAllAnimations() {
  ScrollTrigger.getAll().forEach(st => st.kill())
  animateHero()
  animateSection('.body-parts-section', '.section-title', '.bp-card')
  animateSectionLabel('.body-parts-section .section-label')
  animateSection('.featured-section', '.section-title', '.featured-card')
  animateSectionLabel('.featured-section .section-label')
  animateImageReveal('.featured-image img')
  animateContactCard()
  animateSection('.exercises-page', '.section-title', '.exercise-card')
  animateSectionLabel('.exercises-page .section-label')
  animateImageReveal('.exercise-card-image img')
  animateWelcome()
  animateTodayCards()
  animateLeaderboard()
}

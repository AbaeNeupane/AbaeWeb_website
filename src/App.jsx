import { useEffect, useRef, useState, useCallback } from 'react'

/* ─── DATA ─────────────────────────────────────────────────────────────── */
const TYPED_STRINGS = [
  'BSc.CSIT Student',
  'Web Developer',
  'Open Source Enthusiast',
  'Problem Solver',
  'Data Science Curious',
]

const SKILLS = [
  { cat: 'Frontend',        items: [{ n: 'HTML & CSS', p: 88 }, { n: 'JavaScript', p: 76 }, { n: 'React', p: 62 }] },
  { cat: 'Backend & Lang',  items: [{ n: 'Python', p: 68 }] },
  { cat: 'Tools & Infra',   items: [{ n: 'Git & GitHub', p: 82 }, { n: 'VS Code', p: 90 }] },
  { cat: 'CS Fundamentals', items: [{ n: 'Data Structures', p: 63 }, { n: 'Algorithms', p: 58 }] },
]

const TECH = ['HTML5','CSS3','Tailwind','JavaScript','React','Python', 'Django','Git','VS Code','GitHub']

const PROJECTS = [
  {
    title: 'Portfolio v1',
    desc: 'My first portfolio site — built from scratch with vanilla HTML, CSS & JS to learn by doing. The starting point that inspired this redesign.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    color: '#f472b6',
    icon: '🎨',
    link: 'https://avishekneupane.com.np/',
    featured: false,
    num: '01',
  },
]

/* ─── HOOKS ─────────────────────────────────────────────────────────────── */
function useTyped(strings, speed = 75, pause = 2200) {
  const [text, setText] = useState('')
  const [idx, setIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [del, setDel] = useState(false)
  useEffect(() => {
    const cur = strings[idx]
    const t = setTimeout(() => {
      if (!del) {
        setText(cur.slice(0, charIdx + 1))
        if (charIdx + 1 === cur.length) setTimeout(() => setDel(true), pause)
        else setCharIdx(c => c + 1)
      } else {
        setText(cur.slice(0, charIdx - 1))
        if (charIdx === 0) { setDel(false); setIdx(i => (i + 1) % strings.length) }
        else setCharIdx(c => c - 1)
      }
    }, del ? speed / 2.2 : speed)
    return () => clearTimeout(t)
  }, [charIdx, del, idx, strings, speed, pause])
  return text
}

function useScrollSpy(ids) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const handler = () => {
      const y = window.scrollY + 140
      for (let i = ids.length - 1; i >= 0; i--) {
        const el = document.getElementById(ids[i])
        if (el && el.offsetTop <= y) { setActive(ids[i]); break }
      }
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [ids])
  return active
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-s')
    const ob = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); ob.unobserve(e.target) } }),
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    )
    els.forEach(el => ob.observe(el))
    return () => ob.disconnect()
  })
}

function useSkillAnim() {
  const ref = useRef(null)
  const [go, setGo] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setGo(true); ob.disconnect() } },
      { threshold: 0.2 }
    )
    ob.observe(ref.current)
    return () => ob.disconnect()
  }, [])
  return [ref, go]
}

/* ─── CURSOR ────────────────────────────────────────────────────────────── */
function Cursor() {
  const dot  = useRef(null)
  const ring = useRef(null)
  const pos  = useRef({ x: 0, y: 0 })
  const rpos = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const move = e => {
      pos.current = { x: e.clientX, y: e.clientY }
      if (dot.current) { dot.current.style.left = e.clientX + 'px'; dot.current.style.top = e.clientY + 'px' }
    }
    window.addEventListener('mousemove', move)
    let raf
    const loop = () => {
      rpos.current.x += (pos.current.x - rpos.current.x) * 0.13
      rpos.current.y += (pos.current.y - rpos.current.y) * 0.13
      if (ring.current) { ring.current.style.left = rpos.current.x + 'px'; ring.current.style.top = rpos.current.y + 'px' }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    const on  = () => ring.current?.classList.add('big')
    const off = () => ring.current?.classList.remove('big')
    document.querySelectorAll('a,button,.pcard,.s-icon,.chip,.tc').forEach(el => {
      el.addEventListener('mouseenter', on)
      el.addEventListener('mouseleave', off)
    })
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf) }
  }, [])
  return (
    <>
      <div id="cursor-dot"  ref={dot}  />
      <div id="cursor-ring" ref={ring} />
    </>
  )
}

/* ─── PARTICLES ──────────────────────────────────────────────────────────── */
function Particles() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {Array.from({ length: 18 }).map((_, i) => (
        <div key={i} className="particle" style={{
          left: `${Math.random() * 100}%`,
          bottom: `${Math.random() * 20}%`,
          width:  `${2 + Math.random() * 3}px`,
          height: `${2 + Math.random() * 3}px`,
          '--dur': `${8 + Math.random() * 14}s`,
          '--del': `${Math.random() * 10}s`,
          background: i % 3 === 0 ? 'var(--c1)' : i % 3 === 1 ? 'var(--c2)' : 'var(--c3)',
        }} />
      ))}
    </div>
  )
}

/* ─── NAVBAR ─────────────────────────────────────────────────────────────── */
const NAV_IDS = ['hero', 'about', 'skills', 'projects', 'contact']

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const active = useScrollSpy(NAV_IDS)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <nav id="nav" className={scrolled ? 'scrolled' : ''}>
      <a href="#hero" className="nav-logo"><span>{'<'}</span>Avishek<span>{'/>'}</span></a>
      <div className="nav-links">
        {['about','skills','projects','contact'].map((id, i) => (
          <a key={id} href={`#${id}`} className={active === id ? 'active' : ''}>
            <span style={{ color: 'var(--c1)', marginRight: 4, fontSize: '.65rem' }}>0{i+1}.</span>{id}
          </a>
        ))}
        <a href="mailto:abeneupane5@gmail.com" className="nav-cta">Hire Me</a>
      </div>
    </nav>
  )
}

/* ─── HERO ───────────────────────────────────────────────────────────────── */
function Hero() {
  const typed = useTyped(TYPED_STRINGS)
  return (
    <section id="hero">
      <div className="hero-bg-grid" />
      <div className="hero-orb hero-orb-1" />
      <div className="hero-orb hero-orb-2" />
      <div className="hero-orb hero-orb-3" />

      <div className="hero-inner">
        <div className="hero-eyebrow">Hello, World — I'm</div>

        <h1 className="hero-name">
          <span className="line1">Avishek</span>
          <span className="line2">Neupane.</span>
        </h1>

        <div className="hero-typed-row">
          <span className="hero-typed-prefix">→</span>
          <span className="hero-typed-text">{typed}</span>
          <span className="hero-caret" />
        </div>

        <p className="hero-desc">
          A passionate <em>BSc.CSIT student</em> from <em>Nepal 🇳🇵</em> at Bhaktapur Multiple Campus,
          turning curiosity into code — one project at a time.
          Currently diving deep into <em>web development</em> and loving every bug along the way.
        </p>

        <div className="hero-btns">
          <a href="#projects" className="btn-primary">
            View My Work
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="#contact" className="btn-secondary">
            Get in Touch
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v12H4zM22 6l-10 7L2 6"/></svg>
          </a>
        </div>

        <div className="hero-stats">
          {[['3+','Projects Built'],['2+','Years Learning'],['∞','Curiosity']].map(([n,l]) => (
            <div key={l}>
              <div className="hero-stat-num">{n}</div>
              <div className="hero-stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-hint">
        <div className="scroll-line" />
        SCROLL
      </div>
    </section>
  )
}

/* ─── ABOUT ──────────────────────────────────────────────────────────────── */
function About() {
  useReveal()
  return (
    <section id="about" className="section">
      <div className="section-inner">
        <div className="rv" style={{ marginBottom: 56 }}>
          <div className="section-label">Get to Know Me</div>
          <h2 className="section-title">About <span className="hl">Me</span></h2>
          <p className="section-sub">The story behind the code — who I am, what drives me, and where I'm headed.</p>
        </div>

        <div className="about-grid">
          <div className="rv-l">
            <div className="terminal-window">
              <div className="terminal-bar">
                <div className="t-dot" style={{ background: '#ff5f57' }} />
                <div className="t-dot" style={{ background: '#febc2e' }} />
                <div className="t-dot" style={{ background: '#28c840' }} />
                <span className="t-title">avishek.config.json</span>
              </div>
              <div className="terminal-body">
                <div><span className="t-brace">{'{'}</span></div>
                {[
                  ['"name"',       '"Avishek Neupane"', 'str'],
                  ['"alias"',      '"Abae"',            'str'],
                  ['"age"',        '20',                'num'],
                  ['"location"',   '"Bhaktapur, Nepal 🇳🇵"','str'],
                  ['"degree"',     '"BSc.CSIT"',        'str'],
                  ['"college"',    '"BKMC, TU"',        'str'],
                  ['"focus"',      '"Web Development"', 'str'],
                  ['"available"',  'true',              'bool'],
                ].map(([k, v, type]) => (
                  <div key={k} style={{ paddingLeft: 20 }}>
                    <span className="t-key">{k}</span>
                    <span className="t-brace">{': '}</span>
                    <span className={type === 'str' ? 't-str' : type === 'num' ? 't-num' : 't-bool'}>{v}</span>
                    <span className="t-brace">,</span>
                  </div>
                ))}
                <div style={{ paddingLeft: 20 }}>
                  <span className="t-key">"hobbies"</span>
                  <span className="t-brace">{': ['}</span>
                  {['"coding"','"open source"','"learning"'].map((h, i, a) => (
                    <span key={h}><span className="t-str">{h}</span>{i < a.length - 1 && <span className="t-brace">, </span>}</span>
                  ))}
                  <span className="t-brace">{']'}</span>
                </div>
                <div><span className="t-brace">{'}'}</span></div>
              </div>
            </div>
          </div>

          <div className="rv-r about-text">
            <p>
              Hey! I'm <em>Avishek</em> — a computer science student from Nepal who got hooked on web development
              and decided to learn by actually building things. This portfolio is proof of that philosophy.
            </p>
            <p>
              I'm currently studying <em>BSc.CSIT</em> at Bhaktapur Multiple Campus (Tribhuvan University),
              where I'm building a strong foundation in algorithms, data structures, and software engineering.
              Outside class, I'm always working on a side project or exploring a new technology.
            </p>
            <p>
              My goal is to grow into a <em>full-stack developer</em> who can take ideas from wireframe to deployment —
              shipping clean, fast, accessible web experiences that actually make a difference.
            </p>

            <div className="trait-chips">
              {['Curious','Detail-Oriented','Fast Learner','Team Player','Problem Solver','Self-Driven'].map(t => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>

            <div className="social-row">
              <a href="https://www.facebook.com/abe.neupane/" target="_blank" rel="noreferrer" className="s-icon" title="Facebook">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="https://github.com/AbaeNeupane" target="_blank" rel="noreferrer" className="s-icon" title="GitHub">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
              </a>
              <a href="mailto:abeneupane5@gmail.com" className="s-icon" title="Email">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
              <a href="tel:+9779861997464" className="s-icon" title="Phone">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 012 3.22 2 2 0 014 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── SKILLS ─────────────────────────────────────────────────────────────── */
function Skills() {
  useReveal()
  const [ref, go] = useSkillAnim()
  return (
    <section id="skills" className="section" ref={ref}>
      <div className="section-inner">
        <div className="rv" style={{ marginBottom: 56 }}>
          <div className="section-label">What I Can Do</div>
          <h2 className="section-title">My <span className="hl">Skills</span></h2>
          <p className="section-sub">Technologies and tools I've picked up on my journey, always adding more to the list.</p>
        </div>

        <div className="skills-grid">
          {SKILLS.map((grp, gi) => (
            <div key={grp.cat} className="skill-group rv" style={{ transitionDelay: `${gi * 0.1}s` }}>
              <div className="sg-label">{grp.cat}</div>
              {grp.items.map((sk, si) => (
                <div key={sk.n} className="skill-item">
                  <div className="skill-row">
                    <span className="skill-name">{sk.n}</span>
                    <span className="skill-pct">{sk.p}%</span>
                  </div>
                  <div className="skill-track">
                    <div
                      className={`skill-fill${go ? ' go' : ''}`}
                      style={{
                        width: `${sk.p}%`,
                        transitionDelay: go ? `${(gi * 3 + si) * 0.12}s` : '0s',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="rv tech-cloud" style={{ transitionDelay: '0.3s' }}>
          {TECH.map(t => <span key={t} className="tc">{t}</span>)}
        </div>
      </div>
    </section>
  )
}

/* ─── PROJECT CARD ───────────────────────────────────────────────────────── */
function ProjectCard({ p, delay }) {
  const cardRef = useRef(null)

  const handleMouseMove = useCallback(e => {
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top)  / rect.height) * 100
    cardRef.current.style.setProperty('--mouse-x', x + '%')
    cardRef.current.style.setProperty('--mouse-y', y + '%')
  }, [])

  return (
    <div className="rv" style={{ transitionDelay: `${delay}s` }}>
      <div
        ref={cardRef}
        className="pcard"
        onMouseMove={handleMouseMove}
        onClick={() => window.open(p.link, '_blank')}
      >
        <div className="pcard-top" style={{ background: `linear-gradient(90deg, ${p.color}, transparent)` }} />
        <div className="pcard-body">
          <div className="pcard-header">
            <div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '.65rem', color: 'var(--muted)', marginBottom: 6 }}>
                {p.num}
              </div>
              <span className="pcard-icon">{p.icon}</span>
            </div>
            <div className="pcard-links">
              <a href={p.link} target="_blank" rel="noreferrer" className="pcard-link"
                onClick={e => e.stopPropagation()} title="Live Demo">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                  <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                </svg>
              </a>
            </div>
          </div>

          <h3 className="pcard-title">{p.title}</h3>
          <p className="pcard-desc">{p.desc}</p>

          <div className="pcard-tags">
            {p.tags.map(t => (
              <span key={t} className="ptag" style={{
                background: `${p.color}10`,
                border: `1px solid ${p.color}30`,
                color: p.color,
              }}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── PROJECTS ───────────────────────────────────────────────────────────── */
function Projects() {
  useReveal()
  return (
    <section id="projects" className="section">
      <div className="section-inner">
        <div className="rv" style={{ marginBottom: 56 }}>
          <div className="section-label">What I've Built</div>
          <h2 className="section-title">Featured <span className="hl">Projects</span></h2>
          <p className="section-sub">A selection of things I've built, each one taught me something new.</p>
        </div>

        <div className="projects-grid">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} p={p} delay={i * 0.12} />
          ))}
        </div>

        {/* GitHub CTA */}
        <div className="rv" style={{ textAlign: 'center', marginTop: 56, transitionDelay: '0.3s' }}>
          <p style={{ color: 'var(--muted)', fontFamily: "'DM Mono',monospace", fontSize: '.75rem', marginBottom: 16 }}>
            — more on GitHub —
          </p>
          <a href="https://github.com/AbaeNeupane" target="_blank" rel="noreferrer" className="btn-secondary">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
            View GitHub Profile
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── CONTACT ────────────────────────────────────────────────────────────── */
function Contact() {
  useReveal()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const submit = () => {
    if (!form.name || !form.email || !form.message) return
    const s = encodeURIComponent(`Portfolio Contact from ${form.name}`)
    const b = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)
    window.location.href = `mailto:abeneupane5@gmail.com?subject=${s}&body=${b}`
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  const cinfos = [
    { icon: '📧', label: 'EMAIL', val: 'abeneupane5@gmail.com', href:'mailto:abeneupane5@gmail.com' },
    { icon: '📞', label: 'PHONE', val: '+977 9861997464',                href: 'tel:+9779861997464' },
    { icon: '📍', label: 'LOCATION', val: 'Bhaktapur, Nepal 🇳🇵',       href: null },
    { icon: '🕐', label: 'TIMEZONE', val: 'UTC+5:45 (NPT)',              href: null },
  ]

  return (
    <section id="contact" className="section">
      <div className="section-inner">
        <div className="rv" style={{ marginBottom: 56 }}>
          <div className="section-label">Let's Talk</div>
          <h2 className="section-title">Get In <span className="hl">Touch</span></h2>
          <p className="section-sub">Open to collaborations, freelance work, or just a good chat about tech.</p>
        </div>

        <div className="contact-grid">
          <div className="rv-l">
            <h3 className="contact-left" style={{ fontFamily: "'Syne',sans-serif", fontSize: '1.4rem', fontWeight: 700, marginBottom: 14 }}>
              Always happy to connect
            </h3>
            <p style={{ color: 'var(--muted2)', fontSize: '.9rem', lineHeight: 1.85, marginBottom: 32 }}>
              Whether you have a project in mind, want to collaborate on something cool, or simply want to talk tech — my inbox is always open.
            </p>

            {cinfos.map(c => (
              <div key={c.label} className="cinfo-item rv" style={{ transitionDelay: '.1s' }}>
                <span className="cinfo-icon">{c.icon}</span>
                <div>
                  <div className="cinfo-label">{c.label}</div>
                  {c.href
                    ? <a href={c.href} className="cinfo-val">{c.val}</a>
                    : <span className="cinfo-val" style={{ cursor: 'default' }}>{c.val}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="rv-r">
            <div className="form-card">
              <div className="form-row">
                <div>
                  <label className="form-label">NAME</label>
                  <input className="form-input" placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="form-label">EMAIL</label>
                  <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">MESSAGE</label>
                <textarea className="form-textarea" placeholder="What's on your mind?" rows={5} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              <button className="form-btn" onClick={submit}>
                {sent ? '✓ Opening your mail app...' : 'Send Message →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── FOOTER ─────────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer>
      <div className="footer-txt">
       <span>Avishek Neupane</span> · © 2026
      </div>
      <div className="footer-social">
        <a href="https://www.facebook.com/abe.neupane/" target="_blank" rel="noreferrer" className="s-icon" title="Facebook">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
        </a>
        <a href="https://github.com/AbaeNeupane" target="_blank" rel="noreferrer" className="s-icon" title="GitHub">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/></svg>
        </a>
        <a href="mailto:abeneupane5@gmail.com" className="s-icon" title="Email">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
        </a>
      </div>
    </footer>
  )
}

/* ─── APP ────────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <>
      <Cursor />
      <Particles />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

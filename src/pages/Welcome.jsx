// Static component
import { Footer } from '../components/Footer';
import { FunPhysics } from '../components/FunPhysics';
import { motion } from 'framer-motion';

// Bootstrap component
import { Row, Col } from 'react-bootstrap';
// bootstrap icon
import {  BoxArrowUpRight } from 'react-bootstrap-icons'

import zakaMemoji from '../assets/image/zaka-memoji.jpeg';

// Image
import ngefont from '../assets/image/ngefont/ngfont-illustration.png';
import amogasakti from '../assets/image/amogasakti/amogasakti.png';

export function Welcome () {

    const heroItem = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <>
            <section className="home-hero" aria-labelledby="home-hero-title">
                <motion.div
                    className="hero-bento"
                    initial="hidden"
                    animate="visible"
                    transition={{ staggerChildren: 0.08, delayChildren: 0.1 }}
                >
                    <motion.article
                        className="hero-card hero-intro-card"
                        variants={heroItem}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="hero-kicker">
                            <span className="hero-status-dot" aria-hidden="true"></span>
                            Full-stack engineer · Indonesia
                        </div>

                        <h1 id="home-hero-title">
                            Hey, I’m Zaka.
                            <span>I build software for real work—and strange ideas.</span>
                        </h1>

                        <p className="hero-summary">
                            From logistics systems used every day to local-first AI and visual thinking tools. I work from backend architecture to the interface in people’s hands.
                        </p>

                        <div className="hero-actions">
                            <a className="hero-primary-action" href="#experience">
                                Meet the work <span aria-hidden="true">↓</span>
                            </a>
                            <a className="hero-secondary-action" href="https://github.com/ZakaCoding" target="_blank" rel="noreferrer">
                                GitHub <BoxArrowUpRight aria-hidden="true" />
                            </a>
                        </div>

                        <div className="hero-chapters" aria-label="Featured areas">
                            <span><b>01</b> Local AI</span>
                            <span><b>02</b> Logistics</span>
                            <span><b>03</b> Visual thinking</span>
                        </div>
                    </motion.article>

                    <motion.article
                        className="hero-card hero-memoji-card"
                        variants={heroItem}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="memoji-caption">
                            <span>ZakaCoding</span>
                            <span>GMT+7</span>
                        </div>
                        <img
                            src={zakaMemoji}
                            className="hero-memoji"
                            alt="Zaka's memoji smiling behind a sticker-covered laptop"
                            width="1420"
                            height="1781"
                        />
                        <p>Code, coffee, curiosity.</p>
                    </motion.article>

                    <motion.a
                        className="hero-card hero-story-card hero-owa-card"
                        href="https://zakacoding.github.io/ollama-workspace-agent"
                        target="_blank"
                        rel="noreferrer"
                        variants={heroItem}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="story-label">Building now</span>
                        <strong>OwA</strong>
                        <small>Local-first coding agent</small>
                        <BoxArrowUpRight className="story-arrow" aria-hidden="true" />
                    </motion.a>

                    <motion.article
                        className="hero-card hero-story-card hero-logistics-card"
                        variants={heroItem}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="story-label">At work</span>
                        <strong>Logistics</strong>
                        <small>Systems behind real operations</small>
                        <span className="story-count">05 connected products</span>
                    </motion.article>

                    <motion.a
                        className="hero-card hero-story-card hero-cmap-card"
                        href="https://open-cmap.fly.dev/"
                        target="_blank"
                        rel="noreferrer"
                        variants={heroItem}
                        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <span className="story-label">For thought</span>
                        <strong>Open CMAP</strong>
                        <small>Make complex ideas visible</small>
                        <BoxArrowUpRight className="story-arrow" aria-hidden="true" />
                    </motion.a>
                </motion.div>

                <div className="home-hero-footer" aria-hidden="true">
                    <span>Portfolio / 2026</span>
                    <span>Scroll to continue ↓</span>
                </div>
            </section>

            <section id='experience' className='mb-5'>
                <div className="container">
                    <Row>
                        <Col xs={12} lg={6} className='mb-5'>
                            <div className="sticky top-20 pt-5">
                                <h1 className="font-block mb-3 dark:text-white">
                                    Selected Work
                                </h1>
                                <p className="text-gray-400 text-3xl">
                                    As a moonlighting developer and generalist designer, I'm passionate about creating interfaces that are fun, useful, and user-centric.
                                </p>
                            </div>
                        </Col>
                        <Col xs={12} lg={6} className='mb-5'>
                            <div className="rounded-3xl bg-white dark:bg-gray-800 block relative overflow-hidden w-full pb-5 mb-5 hover:-translate-y-2 transition-transform">
                                <div className="flex justify-between p-5">
                                    <div className="title">
                                        <h1 className='font-mona font-bold text-4xl mb-2 text-slate-800 dark:text-white'>Ngefont</h1>
                                        <p className='text-gray-400 text-xl font-light'>
                                            Making the web more beautiful, fast, and open through great typography. Ngefont makes it easy to bring personality and performance to your websites and products. Web for sharing free font
                                        </p>
                                    </div>

                                    <a href="https://ngefont.com" target='_blank' className='text-2xl ml-2' rel="noreferrer">
                                        <BoxArrowUpRight />
                                    </a>
                                </div>
                                <div className='block w-full h-[400px] relative'>
                                    <div className="frame absolute top-0 -right-20 w-full h-[400px] pl-20 py-3 overflow-hidden">
                                        <div className='h-[340px] w-full rounded-sm overflow-y-scroll'>
                                            <img src={ ngefont } alt="ngefont" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-3xl bg-white dark:bg-gray-800 w-full pb-5 mb-5 hover:-translate-y-2 transition-transform">
                                <div className="flex justify-between p-5">
                                    <div className="title">
                                        <h1 className='font-mona font-bold text-4xl mb-2 text-slate-800 dark:text-white'>Takeit</h1>
                                        <p className='text-gray-400 text-xl font-light'>  
                                            TakeIt is a digital agency located in the city of Malang. We specialize in enhancing product branding through professional photography services, such as food and beverage photography. In today's era of digital marketing, having a professional company profile is one of the pathways to gain a competitive edge against other business competitors.
                                        </p>
                                    </div>

                                    <a href="https://takeitoffice.com" target='_blank' className='text-2xl ml-2' rel="noreferrer">
                                        <BoxArrowUpRight />
                                    </a>
                                </div>
                            </div>

                            <div className="rounded-3xl bg-white dark:bg-gray-800 w-full pb-5 hover:-translate-y-2 transition-transform">
                                <div className="flex justify-between p-5 mb-2">
                                    <div className="title">
                                        <h1 className='font-mona font-bold text-4xl mb-2 text-slate-800 dark:text-white'>AMOGASAKTI</h1>
                                        <p className='text-gray-400 text-xl font-light'>
                                            Amogasakti is card game develop by my friends Rifki Fajar, at the time i got trust from him to build a web, then i transform design from figma to code.
                                        </p>
                                    </div>

                                    <a href="https://amogasakti.vercel.app/" target='_blank' className='text-2xl ml-2' rel="noreferrer">
                                        <BoxArrowUpRight />
                                    </a>
                                </div>
                                <div className='px-5'>
                                    <img src={amogasakti} alt="Amogasakti card game" className='rounded-xl' />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>

            <section id="tools" className='mb-5 h-[100vh] flex items-center relative'>
                <div className="container">
                    <Row>
                        <Col xs={12} lg={6} className='mb-5 flex items-center'>
                            <div className="pt-5">
                                <h1 className="font-block mb-3 dark:text-white">
                                    Tools & Experiments
                                </h1>
                                <p className="text-gray-400 text-3xl">
                                    Side projects and experimental tools I've built to solve problems and explore new ideas.
                                </p>
                                <a
                                    href="https://open-cmap.fly.dev/presentation"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full text-green-500 font-medium text-lg transition-colors hover:text-black hover:bg-green-50 dark:hover:bg-green-950"
                                    style={{ border: "1.5px dashed #22c55e" }}
                                >
                                    <span className="w-6 h-6 rounded-full bg-green-50 dark:bg-green-950 flex items-center justify-center text-sm font-bold">+</span>
                                    Read the docs
                                </a>
                            </div>
                        </Col>
                        <Col xs={12} lg={6} className='mb-5'>
                            <div className="rounded-3xl bg-white dark:bg-gray-800 w-full p-5 mb-5 hover:-translate-y-2 transition-transform">
                                <div className="flex justify-between items-start mb-3">
                                    <h1 className='font-mona font-bold text-4xl text-slate-800 dark:text-white'>Open CMAP</h1>
                                    <a href="https://open-cmap.fly.dev/" target='_blank' className='text-2xl ml-2' rel="noreferrer">
                                        <BoxArrowUpRight />
                                    </a>
                                </div>
                                <p className='text-gray-400 text-xl font-light'>
                                    A free and open-source tool for creating concept maps. Visually organize and represent knowledge, making it easier to understand complex ideas and relationships. Create, edit, and share concept maps online.
                                </p>
                                <div className='mt-3'>
                                    <video id="video" class="mx-auto lg:rounded-xl border-0 drop-shadow-lg sm:rounded-none md:rounded-2xl" src="https://open-cmap.fly.dev/assets/video/concept.mp4" autoplay="" loop="" muted=""></video>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>

            <section id='project' className='h-screen relative mb-5'>
                <div className="absolute inset-0 flex flex-col z-0">
                    <div className="mx-auto text-center w-fit py-10 z-10">
                        <h1 className="font-bold lg:text-8xl sm:text-6xl mb-5 dark:text-white">
                            Fun Project
                        </h1>
                        <p className="text-xl text-gray-400">
                            Play around with some objects. Drag, throw, and see physics in action.
                        </p>
                    </div>
                    <div className="flex-1">
                        <FunPhysics />
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}

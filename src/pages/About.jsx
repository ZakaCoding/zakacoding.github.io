import React, { useRef, useEffect } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { motion } from 'framer-motion';

import { Row } from 'react-bootstrap';
import { Col } from 'react-bootstrap';

// Bootstrap Icons
import { Github } from 'react-bootstrap-icons';
import { Linkedin } from 'react-bootstrap-icons';
import { Twitter } from 'react-bootstrap-icons';
import { Instagram } from 'react-bootstrap-icons';

// Lottie Source
import  animoji  from '../assets/lottie/memoji.json';

// logo
import ZakaCodingLogo from '../../public/logo/final-logo.png';
import PillSlider from '../components/PillSlider';

// Bootstrap icons
// import { BiGithub } from 'react-bootstrap-icons';

const About = () => {
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;
        
        const handleWheel = (e) => {
            e.preventDefault();
            scrollContainer.scrollBy({
                left: e.deltaY + e.deltaX,
                behavior: 'auto'
            });
        };

        scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            scrollContainer.removeEventListener('wheel', handleWheel);
        };
    }, []);

    const fadeUp = {
        hidden: { opacity: 0, y: 60 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const fadeRight = {
        hidden: { opacity: 0, x: 80 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8 }
        }
    };

    const fadeLeft = {
        hidden: { opacity: 0, x: -80 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.8 }
        }
    };

    return (

        <>
            <div
                className="overflow-x-scroll overflow-y-hidden flex bg-white h-screen w-screen"
                ref={scrollContainerRef}
                style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
                >
                <motion.div 
                    className="flex-grow-1 flex-shrink-0 w-screen h-screen relative" 
                    style={{ scrollSnapAlign: 'start' }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <section className='flex content-center space-x-7 px-5 pt-28'>
                        <motion.h1
                            variants={fadeLeft}
                            initial="hidden"
                            animate="visible"
                            className='text-8xl font-bold font-mona'
                        >
                            ZakaCoding
                        </motion.h1>
                        <motion.p
                            variants={fadeRight}
                            initial="hidden"
                            animate="visible"
                            className='my-auto text-xl text-gray-500'
                        >
                            Hello World! I'm  <span className='text-black font-bold'>Zaka</span>, a fullstack web developer with experience in backend and frontend development. I design and code beautifully simple things and love what I do. <br /> <br />
                            Kindly reach out if you see me a good fit.
                        </motion.p>
                    </section>
                    <section className='p-5 absolute w-full bottom-0 flex items-center justify-between'>
                        {/* <img src={ZakaCodingLogo} alt="My LOGO" className='max-w-xl' /> */}
                        <motion.img
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className='max-w-xl'
                        src={ZakaCodingLogo}></motion.img>

                        <Player
                            src={animoji}
                            hover
                            speed={2.1}
                            className='w-80 cursor-grab memoji-float'
                        />

                        <div className="absolute right-10 bottom-0">
                            <svg className='w-32 arrow' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
                                <path fill="#212B50" d="M227.68 182.95c-20.16 4.41-40.6 7.36-61.19 8.75-9.9.67-19.9 1.17-29.82.92-6.73-.17-14.22-.92-19.96-4.79-7.49-5.05-6.75-13.98-5.35-21.87 1.74-9.84 3.07-19.7 3.58-29.69.43-8.51.93-17.73-1.98-25.9-2.62-7.37-7.96-12.78-15.22-15.65-17.34-6.87-39.26-1.01-54.55 8.23-3.57 2.16-.31 7.78 3.28 5.61 7.78-4.7 16.33-7.91 25.32-9.32 7.89-1.23 16.82-1.44 24.31 1.77 8.07 3.46 11.54 10.88 12.34 19.26.9 9.47.02 19.31-1.03 28.73-1.68 15.02-9.45 35 6.72 44.86 5.91 3.61 13.1 4.74 19.91 5.14 9.3.54 18.75 0 28.03-.54 22.65-1.28 45.19-4.41 67.35-9.26 4.08-.89 2.36-7.16-1.73-6.27z"></path><path fill="#212B50" d="M255.06 172.05l-55.25-3.36c-4.18-.25-4.16 6.25 0 6.5l50.33 3.06c-6.79 11.78-22.45 16.75-32.74 24.7-3.3 2.55 1.33 7.12 4.6 4.6 12.83-9.92 30.13-14.77 36.19-31.39.77-2.11-1.19-4-3.13-4.11z"></path>
                            </svg>
                        </div>
                    </section>
                </motion.div>
                <motion.div 
                    className="flex-grow-1 flex-shrink-0 w-screen h-screen relative" 
                    style={{ scrollSnapAlign: 'start' }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                >
                    <Row className='h-full'>
                        <Col xs lg={6} className='flex items-center flex-wrap'>
                            <motion.section
                                variants={fadeLeft}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className='block px-5 pt-28'
                            >
                                <div className="flex items-center text-gray-400">
                                    <div className='mr-2 relative flex h-3 w-3'>
                                        <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </div>
                                    <strong>AVAILABLE FOR WORK</strong>
                                </div>
                                <h1 className='text-5xl font-bold text-black mb-3'>
                                    LET'S BUILD SOMETHING GREAT (READY WHEN YOU ARE)
                                </h1>
                                <p className='text-3xl text-gray-500'>
                                    Thanks for stopping by, I’m currently looking to join a new team of creative designers and developers. If you think we might be a good fit for one another. send me an email 📧
                                </p>
                            </motion.section>
                            <section className='flex items-center px-5 text-2xl'>
                                <span className='text-gray-400 mr-2'>Elsewhere</span>

                                <div className='flex items-center content-center'>
                                    <a className='mx-2 my-auto' href="https://github.com/ZakaCoding"><Github /></a>
                                    <a className='mx-2 my-auto' href="https://twitter.com/zakacoding"><Twitter /></a>
                                    <a className='mx-2 my-auto' href="https://www.linkedin.com/in/zaka-n-693018111"><Linkedin /></a>
                                    <a className='mx-2 my-auto' href="https://instagram.com/youn8e_"><Instagram /></a>
                                </div>
                            </section>
                        </Col>
                        <Col xs lg={6}>
                            <section className='h-full flex items-center justify-center text-center'>
                                <div className="block">
                                    {/* <a href="mailto:zakanoor@outlook.co.id" className='p-2 px-4 rounded-lg border-2 border-gray-300 shadow-lg text-2xl hover:ring-blue-700 hover:ring-4'> */}
                                    <motion.a
                                        variants={fadeUp}
                                        initial="hidden"
                                        whileInView="visible"
                                        className='p-2 px-4 rounded-lg border-2 border-gray-300 shadow-lg text-2xl hover:ring-blue-700 hover:ring-4'
                                        href="mailto:zakanoor@outlook.co.id">
                                        <span className="text-gray-400">Say hi, </span>
                                        <span className='text-blue-700'>zakanoor@outlook.co.id</span>
                                    </motion.a>
                                    <p className="text-2xl text-gray-400 mt-4">Looking for help? Feel free to reach out!</p>
                                </div>
                            </section>
                        </Col>
                    </Row>
                </motion.div>
                <div className="flex-grow-1 flex-shrink-0 w-screen h-screen flex items-center justify-center relative"
                    style={{ scrollSnapAlign: 'start' }}>

                    <PillSlider />

                </div>
            </div>
        </>

    );
}

export default About;
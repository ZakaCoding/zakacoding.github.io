import { Row } from "react-bootstrap"
import { Col } from "react-bootstrap"
// bootstrap icon
import { CCircle } from 'react-bootstrap-icons'

export function Footer () {
    return(
        <>
            <footer className="w-full px-4">
                <Row>
                    <Col className="mb-3" xs='12' md='6' lg='6'>
                        <a href="https://zakacoding.github.io" className='flex justify-start content-center my-0 mx-auto logo group'>
                            <svg className='w-7 mr-2 transform group-hover:-rotate-6' viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <rect width="512" height="512" rx="50" className="fill-black dark:fill-white"/>
                                <path d="M283.666 323.207V361H109.936V323.207L231.518 174.379V173.793H109.936V136H283.666V173.793L162.523 322.621V323.207H283.666ZM443.188 273.988C443.188 259.34 438.012 246.791 427.66 236.342C417.406 225.893 404.906 220.668 390.16 220.668C375.512 220.668 362.963 225.941 352.514 236.488C342.162 246.938 336.986 259.438 336.986 273.988C336.986 288.832 342.162 301.527 352.514 312.074C362.963 322.523 375.512 327.748 390.16 327.748C405.004 327.748 417.553 322.523 427.807 312.074C438.061 301.527 443.188 288.832 443.188 273.988ZM443.188 361V333.168H442.602C437.035 342.348 429.32 350.16 419.457 356.605C409.691 362.953 398.119 366.127 384.74 366.127C359.154 366.127 337.377 357.338 319.408 339.76C301.537 322.084 292.602 300.16 292.602 273.988C292.602 248.012 301.537 226.234 319.408 208.656C337.377 190.98 359.154 182.143 384.74 182.143C408.373 182.143 427.66 192.25 442.602 212.465H443.188V187.27H485.814V361H443.188Z" className="fill-white dark:fill-black"/>
                            </svg>

                            <svg className='w-7 dark:fill-white' viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="512" height="512" rx="50" className='fill-black dark:fill-white'/>
                                <rect x="275.822" y="354.283" width="37.9892" height="228.315" rx="18.9946" transform="rotate(120 275.822 354.283)" className='fill-white dark:fill-black'/>
                                <rect x="256.736" y="142.854" width="37.9892" height="228.315" rx="18.9946" transform="rotate(60 256.736 142.854)" className='fill-white dark:fill-black'/>
                                <rect x="417.036" y="74.1604" width="38.2725" height="374.324" rx="19.1363" transform="rotate(20 417.036 74.1604)" className='fill-white dark:fill-black'/>
                            </svg>
                        </a>
                    </Col>
                    <Col className="mb-3 flex items-center md:justify-end lg:justify-end sm:justify-start" xs='12' md='6' lg='6'>
                        <div className="block">
                            <div className="flex items-center content-center sm:justify-end justify-left">
                                <CCircle className="dark:text-white text-3xl mr-2" />
                                <h2 className="text-gray-800 font-mona text-3xl font-bold dark:text-white">
                                    ZakaCoding 2025
                                </h2>
                            </div>
                            <h2 className="sm:text-right text-left text-gray-800 dark:text-white pr-1 font-bold">FULLSTACK WEB DEV</h2>
                        </div>
                    </Col>
                </Row>
            </footer>
        </>
    )
}
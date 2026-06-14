import { NavLink } from 'react-router-dom';
import Switcher from '../functions/switchTheme';
import { Alt } from 'react-bootstrap-icons';

export function Navbar() {
  return (
    <>
      <header className='fixed z-10 top-2 left-0 w-full p-2 flex content-center lg:justify-center sm:justify-start transition-all duration-300 navbar-header'>
        <nav className='rounded-3xl p-2 px-1 bg-gray-200 dark:bg-gray-800'>
          <ul className='flex content-center justify-center'>
            <li className='flex'>
              <NavLink to='/' className={
                ({ isActive }) => (isActive ? 'transition-all duration-300 p-2 px-4 mx-2 cursor-pointer rounded-3xl text-gray-600 hover:text-gray-600 bg-gray-100 dark:bg-slate-700 dark:text-white' : 'transition-all duration-300 p-2 px-4 mx-2 cursor-pointer rounded-3xl text-gray-500 hover:text-gray-500')
              }>Home</NavLink>
            </li>
            <li className='flex'>
              <NavLink to='/about' className={
                ({ isActive }) => (isActive ? 'flex content-center justify-center transition-all duration-300 p-2 px-4 mx-2 cursor-pointer rounded-3xl text-gray-600 hover:text-gray-600 bg-gray-100 dark:bg-slate-700 dark:text-white' : 'flex content-center justify-center transition-all duration-300 p-2 px-4 mx-2 cursor-pointer rounded-3xl text-gray-500 hover:text-gray-500')
              }>
                <span className='mr-2'>About</span> <Alt className='my-auto' /> 
              </NavLink>
            </li>
            <li className='flex'>
              <NavLink to='https://path.cv/zakanoor' className={
                ({ isActive }) => (isActive ? 'transition-all duration-300 p-2 px-4 mx-2 cursor-pointer rounded-3xl text-gray-600 hover:text-gray-600 bg-gray-100 dark:bg-slate-700 dark:text-white' : 'transition-all duration-300 p-2 px-4 mx-2 cursor-pointer rounded-3xl text-gray-500 hover:text-gray-500')
              }>Resume</NavLink>
            </li>
          </ul>
        </nav>

        <Switcher />
      </header>
    </>
  );
}

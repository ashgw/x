'use client';
import './styles.mod.scss';
import React from 'react';
import { useEffect } from 'react';
const Component: React.FC = () => {
  useEffect(() => {
    var header = document.getElementById('myHeader');
    var page = document.getElementById('page');
    var openMenuButton = document.getElementById('openmenu');

    window.addEventListener('scroll', function () {
      page && page.classList.remove('menuopen');
      if (window.scrollY >= 100) {
        header && header.classList.add('sticky');
      } else {
        header && header.classList.remove('sticky');
      }
    });

    // Event listener to remove the sticky class when the button is clicked
    openMenuButton &&
      openMenuButton.addEventListener('click', function () {
        header && header.classList.remove('sticky');
        page && page.classList.add('menuopen');
      });

    var links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {
      link.addEventListener('click', function (event) {
        // Prevent the default action
        event.preventDefault();

        // Get the target element
        // @ts-ignore
        var targetId = this.getAttribute('href');
        var targetElement = document.querySelector(targetId);

        // Smooth scroll to target
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
          });
        }
      });
    });
  }, []);

  return (
    <div>
      <header id="myHeader" className="">
        <svg
          id="logo"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 714.6 401.1"
        >
          <path
            fill="#fff"
            fillRule="evenodd"
            d="M502.8 0h211.8l-23 39.7-138.5 240L483 401H342.7L413 279.6 251.4 0h140.3L483 158.1 538.6 62 502.8 0Zm-201 279.6L140.1 0H0l231.7 401 70-121.4Z"
          />
        </svg>
        <nav>
          <a href="#vision">Vision</a>
          <a href="#knowledge">Knowledge</a>
          <a href="#space">Space</a>
          <a href="#future">Future</a>
          <button id="openmenu">
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>
      <div id="page" className="">
        <section
          id="vision"
          style={{
            backgroundImage: 'url(https://assets.codepen.io/214624/vision.jpg)',
          }}
        >
          <h1>Vision.</h1>
        </section>
        <section
          id="knowledge"
          style={{
            backgroundImage:
              'url(https://assets.codepen.io/214624/knowledge.jpg)',
          }}
        >
          <h1>Knowledge.</h1>
        </section>
        <section
          id="space"
          style={{
            backgroundImage: 'url(https://assets.codepen.io/214624/space.jpg)',
          }}
        >
          <h1>Space.</h1>
        </section>
        <section
          id="future"
          style={{
            backgroundImage: 'url(https://assets.codepen.io/214624/future.jpg)',
          }}
        >
          <h1>Future.</h1>
        </section>
      </div>
      <a
        id="fixedlink"
        target="_blank"
        rel="nofollow noopener"
        href="https://wyld.studio/"
      >
        » See this solution in real usage
      </a>
    </div>
  );
};

export default Component;

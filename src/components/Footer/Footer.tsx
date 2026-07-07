"use client";

import React from "react";
import "./Footer.css";
import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter()
  return (
    <footer className="chat-footer">
      <div className="footer-container">
        <div className="footer-column">
          <div className="header-logo" onClick={() => router.push("/")}>
            <img src="/logo.png" alt="logo img" /><span className="footer-span">MyChat</span>
          </div>
          <p className="footer-about">
            Experience messaging the way it’s meant to be – private, reliable,
            and fun. Stay connected with the people who matter most.
          </p>
        </div>
        <div className="footer-column">
          <h3>Features</h3>
          <ul>
            <li>Private Messaging</li>
            <li>Group Chats</li>
            <li>Media Sharing</li>
            <li>Voice & Video</li>
            <li>Cloud Backup</li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Developers</h3>
          <ul>
            <li>API Docs</li>
            <li>Integrations</li>
            <li>Contribute</li>
            <li>GitHub</li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Support</h3>
          <ul>
            <li>Help Center</li>
            <li>FAQs</li>
            <li>Contact Us</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} MyChat. All rights reserved.</p>
        <div className="footer-social">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <i className="ri-github-fill" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <i className="ri-twitter-fill" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <i className="ri-facebook-fill" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="ri-linkedin-fill" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="ri-linkedin-fill" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            <i className="ri-linkedin-fill" />
          </a>
        </div>
      </div>
    </footer>
  );
}


"use client";
import { useRouter } from "next/navigation";
import "./page.css"

export default function HomePage() {
  const router = useRouter();

  return (
    <div>
      <main className="main">
        <div className="main-container">
          <div className="main-image">
            <img src="/landingPage.png" alt="Chat App" />
          </div>
          <div className="main-content">
            <h1>
              CHAT APP <span>SERVICE</span>
            </h1>
            <p>
              Stay connected like never before with a messaging experience designed for today’s world. Whether you’re having
              a personal one-to-one chat or leading a vibrant group conversation, our platform gives you the tools
              to communicate without limits. Send unlimited text messages, share photos, videos, documents, and voice notes in real time,
              and enjoy smooth media sharing without interruptions.<br></br><br></br>

              Stay in control of your conversations with smart notifications, reliable delivery reports, and the assurance that your
              chats remain private and secure. Jump seamlessly between personal messages and group discussions, organize your
              contacts with ease, and always stay in touch with the people who matter most.
            </p>
            <button
              onClick={() => window.location.href = "https://play.google.com/store/apps/details?id=com.google.android.apps.dynamite&hl=en_IN"}
              className="btn-readmore"
            >
              Read More
            </button>
          </div>
        </div>
      </main>
      <div className="image-cards-wrapper">
        <div className="image-cards">
          <div className="card"><img src="/p1.jpg" alt="Chat App" /></div>
          <div className="card"><img src="/p2.jpg" alt="Chat App" /></div>
          <div className="card"><img src="/p3.png" alt="Chat App" /></div>
          <div className="card"><img src="/p4.jpg" alt="Chat App" /></div>
          <div className="card"><img src="/p5.png" alt="Chat App" /></div>
          <div className="card"><img src="/p6.jpg" alt="Chat App" /></div>
          <div className="card"><img src="/p7.png" alt="Chat App" /></div>
          <div className="card"><img src="/p1.jpg" alt="Chat App" /></div>
          <div className="card"><img src="/p2.jpg" alt="Chat App" /></div>
        </div>
      </div>
      <div className="landing-cards">
        <div className="card">
          <div className="card-icon">👨🏿‍🤝‍👨🏿</div>
          <h3>Users</h3>
          <p>Effortlessly find the person you want to talk to from your contacts or search bar.
            Start a conversation in just a few clicks, whether it’s a friend, colleague, or family member.</p>
        </div>

        <div className="card">
          <div className="card-icon">📜</div>
          <h3>Media, Documents, Links</h3>
          <p>Send and receive various types of media without any hassle. From high-quality photos and videos to important documents,
            our platform supports seamless sharing.</p>
        </div>

        <div className="card">
          <div className="card-icon">👤</div>
          <h3> Edit User </h3>
          <p>Update and Delete your personal information, avatar, and username quickly and easily.Manage your account
            details,Review and update your privacy settings to control who can see your information and chats.</p>
        </div>

        <div className="card">
          <div className="card-icon">👨‍👨‍👧‍👦</div>
          <h3>Group Chatting (only-chatting)</h3>
          <p>Stay connected with multiple friends or colleagues at the same time. Share your thoughts instantly and keep the
            conversation flowing without any delays.</p>
        </div>

        <div className="card">
          <div className="card-icon">😂</div>
          <h3>Enjoy with Jokes & Emojis</h3>
          <p>Express yourself with hundreds of emojis, GIFs, and stickers. Add humor and personality to your chats,
            making every conversation lively and enjoyable.</p>
        </div>

        <div className="card">
          <div className="card-icon">⏱️</div>
          <h3>Save Your Time</h3>
          <p>Begin chatting immediately without waiting for long loading times.
            With our responsive design and real-time messaging system, every message is delivered instantly.</p>
        </div>

        <div className="card">
          <div className="card-icon">🔒</div>
          <h3>Keep Safe and Private</h3>
          <p>Security is our top priority. All your messages, files, and media are protected with end-to-end encryption,
            ensuring that only you and the recipient can read them.</p>
        </div>

        <div className="card">
          <div className="card-icon">📇</div>
          <h3>View Contacts</h3>
          <p>Keep all your contacts organized with our user-friendly dashboard. Add, edit, or remove contacts effortlessly,
            and always know who is online or available to chat.</p>
        </div>

        <div className="card">
          <div className="card-icon">📞</div>
          <h3>Audio Calling</h3>
          <p>Enjoy seamless one-to-one audio and video calls directly in chat. Stay connected with real-time voice and face-to-face conversations.</p>
        </div>

        <div className="card">
          <div className="card-icon">🎥</div>
          <h3>Video Messaging (Comming-Soon)</h3>
          <p>Video messaging feature coming soon to enhance your chat.</p>
        </div>
      </div>

      <div className="video">
        <video controls autoPlay loop muted playsInline>
          <source src="/users.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <img src="/hello.png" alt="Chat App" />
      </div>
    </div>

  );
}

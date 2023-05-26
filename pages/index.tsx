import { Message, PDFChunk } from "@/types";
import endent from "endent";
import Head from "next/head";
import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import LoadingDots from "@/components/ui/LoadingDots";
import React from "react";
import { Typewriter } from "react-simple-typewriter";
import Component from "@/components/Card";

interface MessageItemProps {
  message: Message;
  index: number;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, index }) => {
  const isApiMessage = message.type === "apiMessage";

  const icon = (
    <Image
      src={isApiMessage ? "/bot.svg" : "/user.svg"}
      alt={isApiMessage ? "AI" : "Me"}
      width={30}
      height={30}
      className={isApiMessage ? styles.boticon : styles.usericon}
      priority={true}
      key={index}
    />
  );

  const className = isApiMessage ? styles.apimessage : styles.usermessage;

  return (
    <div key={`chatMessage-${index}`} className={className}>
      {icon}
      <div className={styles.markdownanswer}>
        {isApiMessage ? (
          <Typewriter words={[message.message]} cursor={false} typeSpeed={20} />
        ) : (
          <ReactMarkdown linkTarget={"_blank"}>{message.message}</ReactMarkdown>
        )}
      </div>
    </div>
  );
};

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Check if window is defined before using it
    if (typeof window !== "undefined") {
      try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : initialValue;
      } catch (error) {
        console.log("useLocalStorage read error:", error);
        return initialValue;
      }
    } else {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      // Check if window is defined before using it
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.log("useLocalStorage write error:", error);
    }
  };

  return [storedValue, setValue];
}

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showCardLayout, setShowCardLayout] = useState(true);

  const [query, setQuery] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [sessionUsage, setSessionUsage] = useState<number>(3);
  const [dailyUsage, setDailyUsage] = useLocalStorage<number>(
    "dailyUsage",
    100
  );
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [messageState, setMessageState] = useState<{
    messages: Message[];
    history: [string, string][];
  }>({
    messages: [
      {
        message: "Hello, Ask me about Beyin Technology!",
        type: "apiMessage",
      },
    ],
    history: [],
  });

  const { messages } = messageState;

  const messageListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textAreaRef.current?.focus();
  }, []);

  const matchCount = 5;

  const resetDailyUsage = useCallback(() => {
    if (typeof window !== "undefined") {
      const currentDate = new Date().toLocaleDateString();
      const lastUsageDate = window.localStorage.getItem("lastUsageDate");

      if (lastUsageDate !== currentDate) {
        window.localStorage.setItem("lastUsageDate", currentDate);
        setDailyUsage(100);
      }
    }
  }, [setDailyUsage]);

  useEffect(() => {
    resetDailyUsage();
  }, [resetDailyUsage]);

  const decrementSessionUsage = () => {
    setSessionUsage(sessionUsage - 1);
  };

  useEffect(() => {
    setSessionUsage(15);
  }, []);

  const FooterComp = (props: any) => {
    return (
      <>
        <form className="inputForm" onSubmit={handleAnswer}>
          <textarea
            disabled={isSubmitDisabled}
            onKeyDown={handleEnter}
            ref={textAreaRef}
            autoFocus={true}
            rows={1}
            minLength={10}
            id="userInput"
            name=""
            placeholder={loading ? "Ben is typing..." : "Type your question..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.textarea}
          />
          {loading ? (
            <div className={styles.loadingwheel}>
              <LoadingDots color="#ffffff" />
            </div>
          ) : (
            <button type="submit" className={styles.sendbutton}>
              <Image
                src="/send.svg"
                alt="send"
                width="25"
                height="25"
                className={styles.sendicon}
                priority={true}
              />
            </button>
          )}
        </form>
        <span className="componets-text3">
          Our experimental AI system is here to enhance your Beyin experience.
          While we strive for accuracy, please note that AI suggestions do not
          replace professional advice or our services. We value your feedback to
          improve the quality of the AI bot.
        </span>

        <style jsx>
          {`
            .componets-text3 {
              color: #ffffff;
              max-width: 1100px;
              text-align: center;
              margin-bottom: var(--dl-space-space-unit);
              padding-bottom: var(--dl-space-space-halfunit);
            }

            @media (max-width: 479px) {
              .componets-text3 {
                font-size: 14px;
              }
            }
          `}
        </style>
      </>
    );
  };

  const CardLayout = (props: any) => {
    return (
      <>
        <div className="componets-container">
          {showCardLayout ? (
            <div className="componets-container1">
              <div className="componets-logo">
                <img
                  alt="image"
                  src="/playground_assets/gpt-200h.png"
                  className="componets-image"
                />
              </div>
              <div className="componets-cardicons">
                <div className="componets-container2">
                  <svg viewBox="0 0 1024 1024" className="componets-icon">
                    <path d="M512 295.851l42.667-125.184c3.072-9.088 3.328-19.285 0-29.099-8.021-23.595-33.664-36.181-57.216-28.117-23.595 8.064-36.139 33.621-28.117 57.216l42.667 125.184z"></path>
                    <path d="M170.667 469.333c-9.088-3.072-19.285-3.328-29.099 0-23.595 8.021-36.181 33.664-28.117 57.216 8.064 23.595 33.621 36.139 57.216 28.117l125.184-42.667-125.184-42.667z"></path>
                    <path d="M512 728.149l-42.667 125.184c-3.072 9.088-3.328 19.285 0 29.099 8.021 23.595 33.664 36.181 57.216 28.117 23.595-8.064 36.139-33.621 28.117-57.216l-42.667-125.184z"></path>
                    <path d="M910.549 497.365c-8.021-23.595-33.621-36.181-57.216-28.117l-125.184 42.667 125.184 42.667c9.088 3.072 19.285 3.328 29.099 0 23.552-8.021 36.139-33.664 28.117-57.216z"></path>
                    <path d="M240.469 300.8l118.656 58.325-58.325-118.656c-4.267-8.619-11.307-16-20.565-20.565-22.357-11.008-49.365-1.792-60.373 20.565-10.965 22.315-1.749 49.365 20.608 60.331z"></path>
                    <path d="M219.861 743.765c-10.965 22.315-1.749 49.323 20.565 60.331 22.315 10.965 49.365 1.749 60.331-20.565l58.325-118.656-118.656 58.325c-8.576 4.224-15.957 11.221-20.565 20.565z"></path>
                    <path d="M783.488 723.157l-118.656-58.325 58.325 118.656c4.267 8.619 11.264 16 20.565 20.565 22.315 10.965 49.323 1.749 60.331-20.565 11.008-22.315 1.792-49.365-20.565-60.331z"></path>
                    <path d="M804.011 280.149c11.008-22.357 1.792-49.365-20.523-60.373-22.315-10.965-49.365-1.749-60.331 20.565l-58.411 118.741 118.699-58.368c8.619-4.267 16-11.264 20.565-20.565z"></path>
                    <path d="M512 320c-105.856 0-192 86.144-192 192s86.144 192 192 192 192-86.144 192-192-86.144-192-192-192z"></path>
                  </svg>
                  <span className="componets-text">Examples</span>
                </div>
                <div className="componets-container3">
                  <svg viewBox="0 0 1024 1024" className="componets-icon10">
                    <path d="M618.667 170.667h0.213M618.667 170.667l-106.667 256 213.333 123.648-320 303.019 106.667-256-213.333-123.733 320-302.933M618.667 85.333c-23.979 0.512-43.904 9.344-58.837 23.509l-319.872 302.72c-19.541 18.56-29.227 45.184-26.027 71.936 3.072 26.709 18.645 50.432 41.899 63.915l148.565 86.229-77.909 186.923c-15.445 37.163-2.816 80.171 30.379 103.083 14.677 10.069 31.531 15.104 48.427 15.104 21.248 0 42.368-7.936 58.667-23.381l320-303.061c19.541-18.517 29.227-45.141 26.027-71.893-3.115-26.752-18.688-50.475-41.899-63.915l-148.565-86.101 76.331-183.168c5.248-11.093 8.192-23.509 8.192-36.565 0-47.019-37.973-85.163-85.376-85.333z"></path>
                  </svg>
                  <span className="componets-text1">Capabilities</span>
                </div>
                <div className="componets-container4">
                  <svg viewBox="0 0 1024 1024" className="componets-icon12">
                    <path d="M512 235.136c23.936 0 47.744 15.104 65.877 45.312l252.245 420.437c36.309 60.373 8.277 109.781-62.123 109.781h-512c-70.4 0-98.432-49.451-62.123-109.781l252.245-420.437c18.133-30.208 41.941-45.312 65.877-45.312M512 149.803c-55.296 0-105.899 31.573-139.051 86.656l-252.245 420.523c-33.536 55.851-37.205 115.413-10.027 163.413s80.171 75.605 145.323 75.605h512c65.152 0 118.187-27.563 145.323-75.563s23.509-107.563-10.027-163.413l-252.245-420.437c-33.152-55.211-83.755-86.784-139.051-86.784z"></path>
                    <path d="M567.467 682.667c0 30.633-24.833 55.467-55.467 55.467-30.633 0-55.467-24.833-55.467-55.467 0-30.633 24.833-55.467 55.467-55.467 30.633 0 55.467 24.833 55.467 55.467z"></path>
                    <path d="M576 426.667c0-35.413-28.629-64-64-64s-64 28.587-64 64c0 8.491 1.749 16.597 4.736 23.979 23.637 58.709 59.264 146.688 59.264 146.688s35.627-87.979 59.349-146.688c2.901-7.381 4.651-15.488 4.651-23.979z"></path>
                  </svg>
                  <span className="componets-text2">Limitations</span>
                </div>
              </div>
              <div className="componets-card-f">
                <Component
                  rootClassName="component-root-class-name"
                  onTextClick={props.onTextClick}
                ></Component>
                <Component
                  text="Remembers what user said earlier in the conversation"
                  rootClassName="component-root-class-name3"
                ></Component>
                <Component
                  text="May occasionally generate incorrent information"
                  rootClassName="component-root-class-name9"
                ></Component>
              </div>
              <div className="componets-card-s">
                <Component
                  text='"Can you recommend some services from Beyin?" →'
                  rootClassName="component-root-class-name2"
                  onTextClick={props.onTextClick}
                ></Component>
                <Component
                  text="Allows user to provide follow- up questions"
                  rootClassName="component-root-class-name4"
                ></Component>
                <Component text="May occasionally produce harmful instructions or biased content"></Component>
              </div>
              <div className="componets-card-t">
                <Component
                  text="“Does Beyin provide AI services?” →"
                  rootClassName="component-root-class-name1"
                  onTextClick={props.onTextClick}
                ></Component>
                <Component
                  text="Trained to decline inappropriate requests"
                  rootClassName="component-root-class-name5"
                ></Component>
                <Component
                  text="Limited knowledge about Beyin"
                  rootClassName="component-root-class-name6"
                ></Component>
              </div>
            </div>
          ) : (
            <div className="componets-container1">
              <div className={styles.cloud}>
                <div ref={messageListRef} className={styles.messagelist}>
                  {messages.map((message, index) => (
                    <MessageItem
                      key={`chatMessage-${index}`}
                      message={message}
                      index={index}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.center}>
                {alertVisible && (
                  <div className={styles.alert}>
                    <p>{alertMessage}</p>
                  </div>
                )}
                {(sessionUsage <= 0 || dailyUsage <= 0) && (
                  <div className="boxText">
                    <p className="textAlret">
                      Oops! You have exhausted all of your available messages
                      for this session. For more information please contact us.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="componets-container5">
            <FooterComp />
          </div>
        </div>
        <style jsx>
          {`
            .componets-container {
              color: var(--dl-color-gray-black);
              width: 100%;
              height: 100vh;
              display: flex;
              overflow: auto;
              align-items: center;
              padding-left: var(--dl-space-space-twounits);
              padding-right: var(--dl-space-space-twounits);
              flex-direction: column;
              //background-color: var(--dl-color-gray-black);
              z-index: 2;
            }

            .componets-container1 {
              top: 0px;
              flex: 0 0 auto;
              left: left;
              width: 100%;
              bottom: 0px;
              display: flex;
              position: absolute;
              margin-top: auto;
              align-items: center;
              margin-left: auto;
              margin-right: auto;
              margin-bottom: 160px;
              flex-direction: column;
              justify-content: center;
            }
            .componets-logo {
              flex: 0 0 auto;
              width: 100%;
              height: auto;
              display: flex;
              max-width: 1100px;
              //margin-top: px;
              align-items: center;
              justify-content: center;
            }
            .componets-image {
              width: 100px;
              height: 50px;
              margin-top: px;
              object-fit: cover;
            }
            .componets-cardicons {
              flex: 0 0 auto;
              width: 100%;
              height: 100px;
              display: flex;
              max-width: 1100px;
              margin-top: var(--dl-space-space-unit);
              align-items: flex-start;
              margin-bottom: var(--dl-space-space-halfunit);
              justify-content: space-between;
            }
            .componets-container2 {
              flex: 0 0 auto;
              width: 32%;
              height: auto;
              display: flex;
              position: relative;
              align-items: center;
              padding-top: var(--dl-space-space-unit);
              padding-left: var(--dl-space-space-oneandhalfunits);
              border-radius: var(--dl-radius-radius-radius8);
              margin-bottom: 0px;
              padding-right: var(--dl-space-space-oneandhalfunits);
              flex-direction: column;
              padding-bottom: var(--dl-space-space-unit);
              justify-content: center;
            }
            .componets-icon {
              fill: var(--dl-color-gray-white);
              width: 24px;
              height: 24px;
              margin-bottom: var(--dl-space-space-halfunit);
            }
            .componets-text {
              color: rgb(255, 255, 255);
              font-size: 18px;
              align-self: center;
              text-align: center;
            }
            .componets-container3 {
              flex: 0 0 auto;
              width: 32%;
              height: auto;
              display: flex;
              position: relative;
              align-items: center;
              padding-top: var(--dl-space-space-unit);
              padding-left: var(--dl-space-space-oneandhalfunits);
              border-radius: var(--dl-radius-radius-radius8);
              margin-bottom: 0px;
              padding-right: var(--dl-space-space-oneandhalfunits);
              flex-direction: column;
              padding-bottom: var(--dl-space-space-unit);
              justify-content: center;
            }
            .componets-icon10 {
              fill: var(--dl-color-gray-white);
              width: 24px;
              height: 24px;
              margin-bottom: var(--dl-space-space-halfunit);
            }
            .componets-text1 {
              color: rgb(255, 255, 255);
              font-size: 18px;
              align-self: center;
              text-align: center;
            }
            .componets-container4 {
              flex: 0 0 auto;
              width: 32%;
              height: auto;
              display: flex;
              position: relative;
              align-items: center;
              padding-top: var(--dl-space-space-unit);
              padding-left: var(--dl-space-space-oneandhalfunits);
              border-radius: var(--dl-radius-radius-radius8);
              margin-bottom: 0px;
              padding-right: var(--dl-space-space-oneandhalfunits);
              flex-direction: column;
              padding-bottom: var(--dl-space-space-unit);
              justify-content: center;
            }
            .componets-icon12 {
              fill: var(--dl-color-gray-white);
              width: 24px;
              height: 24px;
              margin-bottom: var(--dl-space-space-halfunit);
            }
            .componets-text2 {
              color: rgb(255, 255, 255);
              font-size: 18px;
              align-self: center;
              text-align: center;
            }
            .componets-card-f {
              flex: 0 0 auto;
              width: 100%;
              height: auto;
              display: flex;
              max-width: 1100px;
              align-items: flex-start;
              margin-bottom: var(--dl-space-space-unit);
              justify-content: space-between;
            }
            .componets-card-s {
              flex: 0 0 auto;
              width: 100%;
              height: auto;
              display: flex;
              max-width: 1100px;
              align-items: flex-start;
              margin-bottom: var(--dl-space-space-unit);
              justify-content: space-between;
            }
            .componets-card-t {
              flex: 0 0 auto;
              width: 100%;
              height: auto;
              display: flex;
              max-width: 1100px;
              align-items: flex-start;
              justify-content: space-between;
            }
            .componets-container5 {
              flex: 0 0 auto;
              left: 0px;
              right: 0px;
              width: 100%;
              bottom: 0px;
              margin: auto;
              display: flex;
              position: absolute;
              align-items: center;
              flex-direction: column;
              max-width: 1100px;
            }
            .componets-form {
              width: 100%;
              height: 100px;
              display: flex;
              max-width: 1100px;
              align-self: center;
              align-items: center;
              justify-content: flex-start;
            }
            .componets-textarea {
              width: 100%;
            }
            .componets-text3 {
              color: #ffffff;
              max-width: 1100px;
              text-align: center;
              margin-bottom: var(--dl-space-space-unit);
              padding-bottom: var(--dl-space-space-halfunit);
            }
            @media (max-width: 991px) {
              .componets-container1 {
                padding-left: var(--dl-space-space-twounits);
                padding-right: var(--dl-space-space-twounits);
              }
              .componets-container5 {
                padding-left: var(--dl-space-space-twounits);
                padding-right: var(--dl-space-space-twounits);
              }
            }
            @media (max-width: 479px) {
              .componets-container {
                padding-left: var(--dl-space-space-unit);
                padding-right: var(--dl-space-space-unit);
              }
              .componets-container1 {
                padding-left: var(--dl-space-space-unit);
                margin-bottom: 200px;
                padding-right: var(--dl-space-space-unit);
              }
              .componets-image {
                width: 118px;
                height: 56px;
              }
              .componets-cardicons {
                align-items: center;
                flex-direction: row;
              }
              .componets-container2 {
                align-self: center;
              }
              .componets-container3 {
                align-self: center;
              }
              .componets-container4 {
                align-self: center;
              }
              .componets-card-f {
                align-items: flex-start;
                margin-bottom: 0px;
                flex-direction: row;
              }
              .componets-card-s {
                align-items: flex-start;
                margin-bottom: 0px;
                flex-direction: row;
              }
              .componets-card-t {
                align-items: flex-start;
                flex-direction: row;
              }
              .componets-container5 {
                padding-left: var(--dl-space-space-unit);
                padding-right: var(--dl-space-space-unit);
              }
              .componets-text3 {
                font-size: 14px;
              }
            }
          `}
        </style>
      </>
    );
  };

  const handleAnswer = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sessionUsage <= 0) {
      alert("No more usage left for this session.");
      return;
    }

    if (dailyUsage <= 0) {
      alert("No more usage left for today.");
      return;
    }

    setShowCardLayout(false);

    decrementSessionUsage();
    setDailyUsage(dailyUsage - 1);

    // Display remaining usage alert and hide it after 3 seconds
    setAlertMessage(`Remaining session usage: ${sessionUsage - 1}`);
    setAlertVisible(true);
    setTimeout(() => {
      setAlertVisible(false);
    }, 5000);

    if (!query) {
      alert("Please enter a query.");
      return;
    }

    setAnswer("");

    const question = query.trim();

    function isMessage(obj: any): obj is Message {
      return (
        typeof obj.type === "string" &&
        (obj.type === "apiMessage" || obj.type === "userMessage") &&
        typeof obj.message === "string"
      );
    }

    setMessageState((state) => {
      const newMessages = [
        ...state.messages,
        {
          type: "userMessage",
          message: question,
        },
      ].filter(isMessage);

      return {
        ...state,
        messages: newMessages,
      };
    });

    setLoading(true);
    setQuery("");

    try {
      const searchResponse = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, matches: matchCount }),
      });

      if (!searchResponse.ok) {
        console.error(searchResponse.statusText);
        setAnswer("Sorry, something went wrong.");
        setLoading(false);
        return;
      }

      const results: PDFChunk[] = await searchResponse.json();

      const prompt = endent`
        You are a helpful AI assistant. query: "${query}"
    
        ${results?.map((d: any) => d.content).join("\n\n")}
    `;

      const answerResponse = await fetch("/api/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, query }),
      });

      if (!answerResponse.ok) {
        console.error(answerResponse.statusText);
        setAnswer("Sorry, something went wrong.");
        setLoading(false);
        return;
      }

      const data = await answerResponse.text();

      if (!data) {
        return;
      }

      setLoading(false);

      setAnswer(data);
      setMessageState((state) => {
        const newMessages = [
          ...state.messages,
          {
            type: "apiMessage",
            message: data,
          },
        ].filter(isMessage);

        return {
          ...state,
          messages: newMessages,
        };
      });

      inputRef.current?.focus();
    } catch (error) {
      console.error(error);
      setAnswer("Sorry, something went wrong.");
      setLoading(false);
    }
  };
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleAnswer(e);
    }
  };

  const isSubmitDisabled = useMemo(() => {
    return loading || sessionUsage <= 0 || dailyUsage <= 0;
  }, [loading, sessionUsage, dailyUsage]);

  const handleEnter = (e: any) => {
    if (e.key === "Enter" && query) {
      handleAnswer(e);
    } else if (e.key == "Enter") {
      e.preventDefault();
    }
  };

  return (
    <>
      <Head>
        <title>Beyin | AI</title>
        <meta name="description" content="GPT-4 interface" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/logo.svg" />
      </Head>

      <div data-overlay-dark="3" className="boxSize">
        <iframe
          src="https://www.thedxi.com/video/about"
          className="iframe"
          width="100%"
          height="100%"
        />
      </div>
      <CardLayout onTextClick={setQuery} />
    </>
  );
}

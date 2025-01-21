"use client";

import { useState } from "react";
import { Message, useChat } from "ai/react";
import styles from "./chat.module.css";

const Chat = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { messages, input, setInput, append, isLoading } = useChat({
    maxSteps: 5,
    onFinish(message, options) {
      if (message.content && options.finishReason === "stop") {
        // Get the text from the element
        const messageElement = document.getElementById(message.id);

        if (messageElement) {
          let text = messageElement.innerHTML;

          // Replace **word** with <strong>word</strong>
          text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

          // Update the innerHTML with the formatted text
          messageElement.innerHTML = text;
        }
      }
    },
  });

  const runChatCommand = async () => {
    append({ content: input, role: "user" });
    setInput("");
  };

  return (
    <div
      className={styles.chatWrapper}
      style={!isExpanded ? { maxHeight: "80px" } : {}}
    >
      <div className={styles.chatContent}>
        <div
          className={styles.chatArrow}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div
            className={styles.arrowUp}
            style={isExpanded ? { transform: "rotate(180deg)" } : {}}
          ></div>
        </div>
        <div className={styles.inputWrapper}>
          <input
            placeholder="Try typing available restaurants"
            className={styles.chatInput}
            value={input}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setInput(event.target.value);
            }}
            onKeyDown={async (event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === "Enter") {
                runChatCommand();
              }
            }}
          />
          <button className={styles.chatBtn} onClick={runChatCommand}>
            Send
          </button>
        </div>

        <div className={styles.chatContentOverflow}>
          {messages.length ? (
            <div
              className={styles.chatContentWrapper}
              style={!isExpanded ? { display: "none" } : {}}
            >
              {messages.map((message: Message) =>
                message.content ? (
                  <div key={message.id} className={styles.messageWrapper}>
                    <div
                      className={styles.messageRole}
                      style={
                        message.role !== "user"
                          ? { backgroundColor: "#3e5f20" }
                          : {}
                      }
                    >
                      {message.role === "user" ? "You" : "Alex"}
                    </div>
                    <div
                      className={styles.messageContent}
                      id={message.id}
                    >{`${message.content}`}</div>
                  </div>
                ) : null
              )}
              {isLoading && (
                <div className={styles.chatLoading}>
                  <span className={styles.chatLoadingContent}></span>
                  <span className={styles.chatLoadingContent}></span>
                  <span className={styles.chatLoadingContent}></span>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Chat;

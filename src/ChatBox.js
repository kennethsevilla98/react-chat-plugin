import React from 'react';
import PropTypes from 'prop-types';

import { KEYS, TIMESTAMPFORMAT } from './constant';
import InputBox from './InputBox';
import MessageBox from './MessageBox';
import Arrow from './arrow.svg';

import './ChatBox.css';

class ChatBox extends React.Component {
  constructor(props) {
    super(props);

    this.scrollToBottom = this.scrollToBottom.bind(this);
    this.handleOnSendMessage = this.handleOnSendMessage.bind(this);
    this.scrollCheck = this.scrollCheck.bind(this);

    this.state = {
      newMessage: false, // header widths,
      isBottom: false,
    };
  }

  scrollCheck(event) {
    const bottom =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (bottom) {
      this.setState({ isBottom: true });
      this.setState({newMessage: false})
    } else {
      this.setState({ isBottom: false });
    }
  }

  scrollToBottom() {
    if (this.messagesList) {
      this.messagesList.scrollTop =
        this.messagesList.scrollHeight - this.messagesList.clientHeight;
 
    }
  }

  onClick() {
    this.setState({ newMessage: false });
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate(prevProps) {
    //   if (bottom) {
    //     console.log("you're at the bottom of the page");
    //     // Show loading spinner and make fetch request to api
    //  }

    if (prevProps.messages !== this.props.messages) {
      if (this.state.isBottom) {
        this.scrollToBottom();
      } else {
        if (this.messagesList.scrollHeight > this.messagesList.clientHeight) {
          this.setState({ newMessage: true });
        }
      }
    }

  }

  handleOnSendMessage(message) {
    this.props.onSendMessage(message);
  }

  render() {
    const {
      messages,
      userId,
      timestampFormat,
      height,
      width,
      disableInput,
      disabledInputPlaceholder,
      placeholder,
      style,
      showTypingIndicator,
      activeAuthor,
      onSendKey,
    } = this.props;



    const messageList = messages.map((message, idx) => {
      return (
        <MessageBox
          key={idx}
          left={message.author && message.author.id !== userId}
          timestampFormat={timestampFormat}
          {...message}
        />
      );
    });

    return (
      <div style={style} className="react-chat-container">
        <div className="react-chat-row">
          <div
            className="react-chat-viewerBox"
            style={{
              height: height,
              width: width,
              position: 'relative',
            }}
          >
            <div
              className="react-chat-messagesList"
              ref={(el) => (this.messagesList = el)}
              onScroll={this.scrollCheck}
            >
              <div className="react-chat-messagesListContent">
                {messageList}
                {showTypingIndicator && activeAuthor !== null && (
                  <MessageBox
                    type="indicator"
                    author={activeAuthor}
                    text=""
                    left={true}
                  />
                )}
              </div>
              {this.state.newMessage ? (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 50,
                    left:0,
                    right:0,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '20%',
                   
                  
                  }}

                  onClick={() => {
                    this.scrollToBottom();
                    this.onClick();}}
                >
              
                    <Arrow  alt="close bubble"
                   height="48x"
                   width="48px"
                   viewBox="0 0 26 26"/>
                  
                </div>
              ) : null}
            </div>
            <InputBox
              onSendMessage={this.handleOnSendMessage}
              disabled={disableInput}
              placeholder={placeholder}
              disabledInputPlaceholder={disabledInputPlaceholder}
              onSendKey={onSendKey}
            />
          </div>
        </div>
      </div>
    );
  }
}

ChatBox.propTypes = {
  messages: PropTypes.array,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSendMessage: PropTypes.func.isRequired,
  timestampFormat: PropTypes.oneOf(TIMESTAMPFORMAT),
  width: PropTypes.string,
  height: PropTypes.string,
  disableInput: PropTypes.bool,
  disabledInputPlaceholder: PropTypes.string,
  placeholder: PropTypes.string,
  style: PropTypes.object,
  showTypingIndicator: PropTypes.bool,
  activeAuthor: PropTypes.object,
  onSendKey: PropTypes.oneOf(KEYS),
};
ChatBox.defaultProps = {
  messages: [],
  timestampFormat: 'calendar',
  disableInput: false,
  disabledInputPlaceholder: '',
  placeholder: '',
  showTypingIndicator: false,
  activeAuthor: null,
};

export default ChatBox;

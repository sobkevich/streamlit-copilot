// import {
//   StreamlitComponentBase,
//   withStreamlitConnection,
//   Streamlit,
// } from "streamlit-component-lib"
// import React, { ReactNode } from "react"
//
// interface State {
//   text: string
//   suggestion: string
//   isFocused: boolean
//   textAreaIsFocused: boolean
// }
//
// class Copilot extends StreamlitComponentBase<State> {
//
//   private userTextarea: HTMLTextAreaElement | null = null;
//   private suggestionTextarea: HTMLTextAreaElement | null = null;
//   public state = {"text": "", "suggestion": "", "isFocused": false, 'textAreaIsFocused': false}
//
//   public render = (): ReactNode => {
//     const height_int = this.props.args["height"]
//     const font_fam = this.props.args["font_family"] + ', sans-serif';
//
//     const f_height = height_int + 'px';
//
//     const f_border = '1px solid rgb(241,242,246)';
//
//     return (
//         <div
//           tabIndex={0}
//           style={
//             {
//               height:f_height,
//               width:'auto',
//               border:this.state.isFocused ? '1px solid red' : f_border,
//               borderRadius:'0.5em',
//               overflowY:'scroll',
//               overflowX:'hidden',
//               position: 'relative',
//               backgroundColor: 'rgb(241,242,246)'
//             }
//           }
//           onFocus={this._onFocus}
//           onBlur={this._onBlur}
//         >
//           <textarea
//   style={
//     {
//       marginLeft:'0.5em',
//       fontFamily:font_fam,
//       marginTop:'0.2em',
//       whiteSpace: 'pre-wrap',
//       width:  'calc(100% - 1.2em)',
//       height: '100%',
//       border: 'none',
//       outline: 'none',
//       position: 'absolute',
//       backgroundColor: 'transparent',
//       color:'rgba(41,51,62,0.5)',
//       padding: '0'
//     }
//   }
//   value={this.state.suggestion}
//   readOnly
//   ref={(textarea) => { this.suggestionTextarea = textarea; }}
// />
//           <textarea
//             style={
//             {
//               marginLeft:'0.5em',
//               fontFamily:font_fam,
//               marginTop:'0.2em',
//               whiteSpace: 'pre-wrap',
//               width:  'calc(100% - 1.2em)',
//               height: '100%',
//               border: 'none',
//               outline: 'none',
//               position: 'absolute',
//               backgroundColor: 'transparent',
//               color:'rgb(41,51,62)',
//               padding: '0'
//             }
//           }
//             value={this.state.text}
//             onChange={this.onChange}
//             onKeyDown={this.onKeyDown}
//             onBlur={this._onTextAreaBlur}
//             onScroll={this.onScroll}
//             ref={(textarea) => { this.userTextarea = textarea; }}
//           />
//         </div>
//     )
//   }
//
//   public componentDidUpdate(): void {
//   if (this.userTextarea && this.suggestionTextarea) {
//     this.suggestionTextarea.scrollTop = this.userTextarea.scrollTop;
//   }
// }
// private onScroll = (): void => {
//     this.forceUpdate();
//   }
//   private onChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
//   const text = event.target.value
//   const api_upl = this.props.args["api_url"]
//   this.setState({ text, suggestion: "" }, () => {
//     if (text.trim() !== "") {
//       this.callApi(text, api_upl).then(suggestion => {
//          if (this.state.text.trim() !== "") {
//           this.setState({ suggestion: this.state.text + suggestion })
//         }
//       })
//     }
//   })
// }
//
//
//   private onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
//   if (event.key === 'Enter') {
//     event.preventDefault()
//     this.setState(prevState => ({
//       text: prevState.suggestion,
//       suggestion: ''
//     }), () => {
//       // Create a synthetic event and call onChange manually
//       const syntheticEvent = {
//         target: { value: this.state.text }
//       } as React.ChangeEvent<HTMLTextAreaElement>;
//       this.onChange(syntheticEvent);
//     })
//   }
// }
//
//   private _onTextAreaBlur = (): void => {
//     this.setState({ textAreaIsFocused: false }, () => {
//       Streamlit.setComponentValue(this.state.text);
//       this.setState({ suggestion: '' });
//     });
//   }
//
//   private _onFocus = (): void => {
//     this.setState({ isFocused: true })
//   }
//
//   private _onBlur = (): void => {
//     this.setState({ isFocused: false })
//   }
//
//   private abortController = new AbortController();
//
// private callApi = async (text: string, api_upl: string): Promise<string> => {
//   if (text.trim() === "") {
//     return "";
//   }
//    // Extract all model_kwargs from this.props.args
//   const {prompt_template, api_url, height, fontFamily, border, ...model_kwargs} = this.props.args;
//   const prompt = prompt_template.replace("{text}", text); // format the prompt
//   const payload = {
//     prompt: prompt,
//     ...model_kwargs,
//     echo: false
//   };
//   const headers = {
//     'Content-Type': 'application/json'
//   };
//
//   // Abort the previous request
//   this.abortController.abort();
//   this.abortController = new AbortController();
//
//   try {
//     const response = await fetch(api_upl, {
//       method: "POST",
//       headers: headers,
//       body: JSON.stringify(payload),
//       signal: this.abortController.signal
//     });
//
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//
//     const responseJson = await response.json();
//     return responseJson["choices"][0]["text"];
//   } catch (error) {
//     if (error.name === 'AbortError') {
//       return "";  // Return empty string if request was aborted
//     }
//     console.error("Error decoding response", error);
//     return "";
//   }
// }
// }
//
// export default withStreamlitConnection(Copilot)


import {
  StreamlitComponentBase,
  withStreamlitConnection,
  Streamlit,
} from "streamlit-component-lib"
import React, { ReactNode } from "react"

interface State {
  text: string
  suggestion: string
  isFocused: boolean
  textAreaIsFocused: boolean
  requestsThisMinute: number
  currentMinute: number
}

class Copilot extends StreamlitComponentBase<State> {

  private userTextarea: HTMLTextAreaElement | null = null;
  private suggestionTextarea: HTMLTextAreaElement | null = null;
  public state = {
    "text": "",
    "suggestion": "",
    "isFocused": false,
    'textAreaIsFocused': false,
    requestsThisMinute: 0,
    currentMinute: Math.floor(Date.now() / 60000)
  }

  public render = (): ReactNode => {
    const { theme } = this.props
    if (!theme) {
      return <div>Theme is undefined, please check streamlit version.</div>
    }
    const height_int = this.props.args["height"]
    const font_fam = theme.font;

    const f_height = height_int + 'px';

    const f_focused = '1px solid ' + theme.primaryColor;
    const f_not_focused = '1px solid ' + theme.secondaryBackgroundColor;

    return (
        <div
          tabIndex={0}
          style={
            {
              height:f_height,
              width:'auto',
              border:this.state.isFocused ? f_focused: f_not_focused,
              borderRadius:'0.5em',
              overflowY:'scroll',
              overflowX:'hidden',
              position: 'relative',
              backgroundColor: theme.secondaryBackgroundColor
            }
          }
          onFocus={this._onFocus}
          onBlur={this._onBlur}
        >
          <textarea
  style={
    {
      marginLeft:'0.5em',
      fontFamily:font_fam,
      marginTop:'0.2em',
      whiteSpace: 'pre-wrap',
      width:  'calc(100% - 1.2em)',
      height: '100%',
      border: 'none',
      outline: 'none',
      position: 'absolute',
      backgroundColor: 'transparent',
      color:theme.secondaryBackgroundColor,
      padding: '0'
    }
  }
  value={this.state.suggestion}
  readOnly
  ref={(textarea) => { this.suggestionTextarea = textarea; }}
/>
          <textarea
            style={
            {
              marginLeft:'0.5em',
              fontFamily:font_fam,
              marginTop:'0.2em',
              whiteSpace: 'pre-wrap',
              width:  'calc(100% - 1.2em)',
              height: '100%',
              border: 'none',
              outline: 'none',
              position: 'absolute',
              backgroundColor: 'transparent',
              color:theme.textColor,
              padding: '0'
            }
          }
            value={this.state.text}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            onBlur={this._onTextAreaBlur}
            onScroll={this.onScroll}
            ref={(textarea) => { this.userTextarea = textarea; }}
          />
        </div>
    )
  }

  public componentDidUpdate(): void {
  if (this.userTextarea && this.suggestionTextarea) {
    this.suggestionTextarea.scrollTop = this.userTextarea.scrollTop;
  }
}
private onScroll = (): void => {
    this.forceUpdate();
  }
  private onChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
  const text = event.target.value
  const api_upl = this.props.args["api_url"]
  this.setState({ text, suggestion: "" }, () => {
    if (text.trim() !== "") {
      this.callApi(text, api_upl).then(suggestion => {
         if (this.state.text.trim() !== "") {
          this.setState({ suggestion: this.state.text + suggestion })
        }
      })
    }
  })
}


  private onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>): void => {
  if (event.key === 'Enter') {
    event.preventDefault()
    this.setState(prevState => ({
      text: prevState.suggestion,
      suggestion: ''
    }), () => {
      // Create a synthetic event and call onChange manually
      const syntheticEvent = {
        target: { value: this.state.text }
      } as React.ChangeEvent<HTMLTextAreaElement>;
      this.onChange(syntheticEvent);
    })
  }
}

  private _onTextAreaBlur = (): void => {
    this.setState({ textAreaIsFocused: false }, () => {
      Streamlit.setComponentValue(this.state.text);
      this.setState({ suggestion: '' });
    });
  }

  private _onFocus = (): void => {
    this.setState({ isFocused: true })
  }

  private _onBlur = (): void => {
    this.setState({ isFocused: false })
  }

  private abortController = new AbortController();

private callApi = async (text: string, api_upl: string): Promise<string> => {
  // Abort the previous request
  this.abortController.abort();
  this.abortController = new AbortController();

  if (text.trim() === "") {
    return "";
  }

  const currentMinute = Math.floor(Date.now() / 60000);
  if (currentMinute > this.state.currentMinute) {
    this.setState({
      currentMinute: currentMinute,
      requestsThisMinute: 0
    });
  } else if (this.state.requestsThisMinute > this.props.args["rpm_limit"]) {
    // Retry after 1 second if limit is exceeded
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.callApi(text, api_upl));
      }, 1000);
    });
  }

  const {prompt_template, api_url, height, fontFamily, border, ...model_kwargs} = this.props.args;
  const prompt = prompt_template.replace("{text}", text); // format the prompt
  const payload = {
    prompt: prompt,
    ...model_kwargs,
    echo: false
  };
  const headers = {
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch(api_upl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(payload),
      signal: this.abortController.signal
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    this.setState(prevState => ({
    requestsThisMinute: prevState.requestsThisMinute + 1
  }));

    const responseJson = await response.json();
    return responseJson["choices"][0]["text"];
  } catch (error) {
    if (error.name === 'AbortError') {
      return "";  // Return empty string if request was aborted
    }
    console.error("Error decoding response", error);
    return "";
  }
}
}

export default withStreamlitConnection(Copilot)

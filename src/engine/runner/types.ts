
export interface OpenAIResponse {
  choices: {
    message: {
      content: string | null;
    };
  }[];
}

export interface OpenAIError {
  error: {
    message: string;
  };
}
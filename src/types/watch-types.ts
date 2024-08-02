export interface Watch {
  id: string;
  target: WatchTarget;
  eventType: EventType;
  createTime: string;
  expireTime: string;
  errorType?: ErrorType;
  state: State;
}

interface WatchTarget {
  topic: {
    topicName: string;
  };
}

enum EventType {
  SCHEMA,
  RESPONSES,
}

enum ErrorType {
  ERROR_TYPE_UNSPECIFIED,
  PROJECT_NOT_AUTHORIZED,
  NO_USER_ACCESS,
  OTHER_ERRORS,
}

enum State {
  STATE_UNSPECIFIED,
  ACTIVE,
  SUSPENDED,
}

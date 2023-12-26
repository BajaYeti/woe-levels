type Item = {
  // read only
  Name: string;
  Type: string;
  Prefix: string;
  Description: string;
  Help: string;
  Actions: Array<Action>;

  //read write
  Location: string;
  State: string;
  Count: number;
};

type Action = {
  Verb: string;
  UnconditionalResponse: string;
  Conditions: Array<Condition>;
  Updates: Array<Update>;
};

type Update = {
  TargetItem: string;
  Property: string;
  Value: string;
};

type Condition = {
  Item: string;
  Property: string;
  Equality: string;
  Value: string;
  PassResponse: string;
  FailResponse: string;
};

type MyRequest = {
  OK: boolean;
  Look: boolean;
  Action: Action;
};

type Check = {
  OK: boolean;
  Feedback: string | null;
};

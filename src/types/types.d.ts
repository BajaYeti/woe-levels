type Item = {
  // read only
  // CSV ID of the item. The first CSV element MUST be unique
  //  subsequent entries can be non-unique aliases or truncations
  //  e.g. "art homework,homework" or "fire alarm,alarm"
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
  OK: boolean; //indicate input parsed OK and requires checking
  Look: { Refresh: boolean; Brevity: boolean }; //inidcate that location needs to be displayed again and in full
  Action: Action; //the action to be processed
  Load: Array<Item> | undefined; //the items to be loaded
};

type Check = {
  OK: boolean;
  Feedback: string | null;
};

type Truncation = {
  short: string;
  long: string;
};

type Process = {
  Feedback: string | null;
  Items: Array<Item>;
};

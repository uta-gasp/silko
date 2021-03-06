// Common types

interface Callback {
  ( err?: string | Error, data?: any );
}

// External libraries

interface MediaRecorder extends EventTarget {
  start();
  stop();
}

declare var MediaRecorder: {
  prototype: MediaRecorder;
  new( stream: MediaStream ): MediaRecorder;
};


interface MediaRecorderDataEvent extends Event {
  data: Blob;
}

interface EventEmitter {
  new ();
  addListener( event: string, handler: Function );
  removeListener( event: string, handler: Function );
  emitEvent( event: string, data: any );
}

interface ResponsiveVoice {
  speak( word: string, voice: string );
}

interface ETUDCustomValueType {
  id: number;
  type: function;
  device: string;
}

interface ETUDState {
  device: string;
  isServiceRunning: boolean;
  isBusy: boolean;
  isConnected: boolean;
  isCalibrated: boolean;
  isTracking: boolean;
  isStopped: boolean;
  isDisconnected: boolean;
}

interface ETUDCustomValueCallbackArg {
  code: number;
  value: any;
}

interface ETUDriver {
  showOptions();
  calibrate();
  toggleTracking();
  getCustomValue( type: ETUDCustomValueType );
  setCustomValue( type: ETUDCustomValueType, value: any );
  listAvailableCustomValue(): Record<string, ETUDCustomValueType>;
}

interface GTFixation {
  ts: number;
  duration: number;
  x: number;
  y: number;
}

interface GTState {
  isServiceRunning: boolean;
  isConnected: boolean;
  isCalibrated: boolean;
  isTracking: boolean;
  isBusy: boolean;
  isStopped: boolean;
  isDisconnected: boolean;
  device: string;
}

interface GTEvents {
  state( GTState );
  target( string, HTMLElement );
  fixation( GTFixation );
}

interface GazeTargets {
  selection: { 
    types: { none: number, cumulativeDwell: number, simpleDwell: number, nod: number, customHeadGesture: number } 
  };

  mapping: { 
    types: { none: number, naive: number, expanded: number, reading: number },
    sources: { samples: number, fixations: number }
  };

  ETUDriver: ETUDriver;

  init( object, GTEvents ): boolean;
  updateTargets();
  reconnect();
}

interface SGWMSettings {
  save();
  isInitialized: boolean;
}

interface SGWMFixationProcessorSettings extends SGWMSettings {
  new (): SGWMFixationProcessorSettings;
  duration: {
    enabled: boolean
  };
  location: {
    enabled: boolean;
    marginX: number;
    marginY: number;
  };
}

interface SGWMSplitToProgressionsSettings extends SGWMSettings {
  new (): SGWMSplitToProgressionsSettings;
  bounds: {
    left: number;
    right: number;
    verticalChar: number;
    verticalLine: number;
  };
  angle: number;
}

interface SGWMProgressionMergerSettings extends SGWMSettings {
  new (): SGWMProgressionMergerSettings;
  minLongSetLength: number;
  fitThreshold: number;
  maxLinearGradient: number;
  removeSingleFixationLines: boolean;
  correctForEmptyLines: boolean;
  currentLineSupportInCorrection: number;
  emptyLineDetectorFactor: number;
  intelligentFirstLineMapping: boolean;
}

interface SGWMWordMapperSettings extends SGWMSettings {
  new (): SGWMWordMapperSettings;
  wordCharSkipStart: numner;
  wordCharSkipEnd: numner;
  scalingDiffLimit: numner;
  rescaleFixationX: boolean;
  partialLengthMaxWordLength: numner;
  effectiveLengthFactor: numner;
  ignoreTransitions: boolean;
}

interface SGWMFixation {
}

interface SGWMWord {
}

interface SGWM {
  new ();
  FixationProcessorSettings: SGWMFixationProcessorSettings;
  SplitToProgressionsSettings: SGWMSplitToProgressionsSettings;
  ProgressionMergerSettings: SGWMProgressionMergerSettings;
  WordMapperSettings: SGWMWordMapperSettings;
  map( object ): {fixations: SGWMFixation[], words: SGWMWord[]};
}

interface FBStorage {
  (): any;
  readonly TaskState: any;
}

interface FBUser {
  readonly name: string;
  readonly displayName: string;
  readonly email: string;
  readonly uid: string;
}

interface FBAuth {
  onAuthStateChanged( cb: function );
  signInWithEmailAndPassword( email: string, password: string ): Promise<FBUser>;
  sendPasswordResetEmail( email: string ): Promise<any>;
  createUserWithEmailAndPassword( email: string, password: string ): Promise<FBUser>;
  signOut();
}

interface FirebaseDataSnapshot {
  readonly state: any;
  readonly bytesTransferred: number;
  readonly totalBytes: number;
  readonly ref: Firebase;
  exists(): boolean;
  val(): any;
  forEach( cb: (data: FirebaseDataSnapshot) => void ): void;
  update( data: any, cb?: (data: any) => void );
  push( data: any );
  child( field: string ): FirebaseDataSnapshot;
  set( data: any, cb?: (data: aby) => void ): Promise;
  once( event: string, cb: (data: FirebaseDataSnapshot) => void, failed?: (err: string) => void ): Promise;
  remove(): Promise;
  orderByChild( field: string ): FirebaseDataSnapshot;
  equalTo( value: string ): FirebaseDataSnapshot;
}

interface Firebase {
  readonly apps: Array<any>;
  initializeApp( object );
  database( object );
  readonly storage: FBStorage;
  auth( authToken?: string ): FBAuth;
  remove();
}

interface FirebaseRef {
  child( name: string ): FirebaseDataSnapshot;
  update( data: any, cb?: () => Promise );
}

declare var EventEmitter: EventEmitter;
declare var GazeTargets: GazeTargets;
declare var SGWM: SGWM;
declare var responsiveVoice: ResponsiveVoice;
declare var firebase: Firebase;

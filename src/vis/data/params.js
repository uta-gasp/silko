export default class Params {

  constructor( args ) {
    args = args || {};
    this.student = args.student;    // String
    this.session = args.session;    // String
    this.grade = args.grade;        // { name: String, studentCount: Number }
  }

};

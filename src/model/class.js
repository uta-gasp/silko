import Recordable from './commons/recordable.js';

import { TaskCreateParams } from './commons/createParams.js';

import Task from './task.js';
import Student from './student.js';

import db from '@/db/db.js';

export default class Class extends Recordable {

  /**
   * @param {string} [id]
   */
  constructor( id ) {
    super( id );

    /** @type {string} */
    this.name = '';
    /** @type {string} teacher ID */
    this.owner = '';
    /** @type {object} {ID: name} */
    this.tasks = {};
    /** @type {object} {ID: name} */
    this.students = {};
  }

  /** @returns {string} */
  static get db() {
    return 'classes';
  }

  /**
   * @param {Callback} cb 
   * @returns {Promise}
   */
  static list( cb ) {
    return db.getAll( Class, cb );
  }

  /**
   * @param {string} id
   * @param {Callback} cb 
   * @returns {Promise}
   */
  static get( id, cb ) {
    return db.get( Class, id, cb );
  }

  /**
   * @param {TaskCreateParams} task 
   * @param {string} type 
   * @param {Callback} cb 
   * @returns {Promise}
   */
  createTask( task, type, cb ) {
    task.syllab.exceptions = Task.textToSyllabs( task.syllabExceptions );

    const taskObj = {
      name: task.name,
      owner: this.owner,
      cls: this.id,
      type: type,
      alignment: task.alignment,
      fontname: task.fontname,
      intro: task.intro,
      pages: Task.textToPages( task.text ),
      syllab: task.syllab,
      speech: task.speech,
      highlight: task.highlight,
      warning: task.warning,
      questionnaire: task.questionnaire,
      useTimeout: task.useTimeout,
      timeout: task.timeout,
      recordAudio: task.recordAudio,
    };

    Task.embedImagesIntoPages( taskObj.pages, task.images );

    return db.add( Task, taskObj, ( err, id ) => {
      if ( err ) {
        return cb( err );
      }

      this.tasks[ id ] = task.name;
      db.updateField( this, `tasks/${id}`, task.name, err => {
        if ( err ) {
          delete this.tasks[ id ];
        }

        cb( err, id );
      } );
    } );
  }

  /**
   * @param {Callback} cb 
   * @returns {Promise}
   */
  getTasks( cb ) {
    return db.getFromIDs( Task, this.tasks, cb );
  }

  /**
   * @param {Task} task 
   * @param {Callback} cb 
   */
  deleteTask( task, cb ) {
    delete this.tasks[ task.id ];
    db.deleteField( this, `tasks/${task.id}`, cb );

    db.getFromIDs( Student, this.students, /** @param {Student[]} students */ ( err, students ) => {
      if ( err ) {
        return console.error( err );
      }

      students.forEach( student => {
        if ( Student.MULTICLASS ) {
          if ( task.id in student.assignments ) {
            student.removeAssignment( task.id, err => {
              if ( err ) {
                return console.error( err );
              }
            } );
          }
        }
        else {
          if ( student.assignments[ this.id ] === task.id ) {
            student.setAssignment( this.id, null, err => {
              if ( err ) {
                return console.error( err );
              }
            } );
          }
        }
      } );
    } );

    task.deleteAllImages( err => {
      if ( err ) {
        console.error( err );
      }
    } );

    db.delete( task, err => {
      if ( err ) {
        console.error( err );
      }
    } );
  }

  /**
   * @param {Callback} cb 
   * @returns {Promise}
   */
  getStudents( cb ) {
    return db.getFromIDs( Student, this.students, cb );
  }

  /**
   * @param {object} newStudents 
   * @param {Callback} cb 
   * @returns {Promise}
   */
  addStudents( newStudents, cb ) {
    const joinedStudents = { ...this.students, ...newStudents };

    return db.updateField( this, 'students', joinedStudents, err => {
      if ( !err ) {
        this.students = joinedStudents;

        db.getFromIDs( Student, newStudents, /** @param {Student[]} students */ ( err, students ) => {
          if ( err ) {
            return console.error( err );
          }

          students.forEach( student => {
            student.addClass( this.id, this.name, err => {
              if ( err ) {
                return console.error( err );
              }
            } );
          } );
        } );
      }

      cb( err );
    } );
  }

  /**
   * @param {Student} student 
   * @param {Callback} cb 
   * @returns {Promise}
   */
  removeStudent( student, cb ) {
    delete this.students[ student.id ];
    db.deleteField( this, `students/${student.id}`, cb );

    return db.get( Student, student.id, ( err, _ /* student */ ) => {
      if ( err ) {
        return console.error( err );
      }

      student.removeClass( this.id, err => {
        if ( err ) {
          return console.error( err );
        }
      } );

      student.setAssignment( this.id, null, err => {
        if ( err ) {
          return console.error( err );
        }
      } );
    } );
  }

}

Recordable.apply( Class );

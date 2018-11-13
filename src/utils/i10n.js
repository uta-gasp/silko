import db from '@/db/db.js';

const repos = {
  db: {
    err_no_resp: {
      en: 'no response',
      fi: 'ei vastausta',
    },
    err_not_supported: {
      en: 'not supported',
      fi: 'ei tuettu',
    },
    err_no_results: {
      en: 'no results',
      fi: 'ei tuloksia',
    },
    err_unknown: {
      en: 'unknown error',
      fi: 'tuntematon virhe',
    },
  },

  navbar: {
    results: {
      en: 'Results',
      fi: 'Tulokset',
    },

    logout: {
      en: 'Log out',
      fi: 'Kirjaudu ulos',
    },
  },

  home: {
    hdr_subtitle: {
      en: 'A reading aid for students and teachers',
      fi: 'Lukemisen apuväline oppilaille ja opettajille',
    },
    hdr_info_title: {
      en: /** @param {string} p1 */ p1 => `As a ${p1.toLowerCase()}, you can`,
      fi: /** @param {string} p1 */ p1 => `${p1} voi`,
    },
    hdr_password_reset: {
      en: 'Send password reset notification to this email:',
      fi: 'Lähetä salasanan asetusviesti tähän osoitteeseen:',
    },

    btn_request_account: {
      en: 'Request an account',
      fi: 'Pyydä tilin luomista',
    },
    btn_forgot_password: {
      en: 'Forgot password?',
      fi: 'Unohditko salasanasi?',
    },
    btn_send: {
      en: 'Send',
      fi: 'Lähetä',
    },

    info_adm_1: {
      en: 'Add and list teachers',
      fi: 'Lisätä opettajia',
    },
    info_adm_2: {
      en: 'Move teachers to other school',
      fi: 'Siirtää opettajia toiseen kouluun',
    },
    info_adm_3: {
      en: 'Add and list students',
      fi: 'Lisätä oppilaita',
    },
    info_adm_4: {
      en: 'Move students to other school',
      fi: 'Siirtää oppilaita toiseen kouluun',
    },
    info_tch_1: {
      en: 'Add, list, edit and remove instructions',
      fi: 'Muokata tehtävien ohjeita',
    },
    info_tch_2: {
      en: 'Add, list, edit and remove classes',
      fi: 'Lisätä ja poistaa luokkia',
    },
    info_tch_3: {
      en: 'Add, list, edit and remove tasks',
      fi: 'Muokata tehtäviä',
    },
    info_tch_4: {
      en: 'Add students to classes, list them and remove',
      fi: 'Lisätä ja poistaa oppilaita luokista',
    },
    info_tch_5: {
      en: 'Assign tasks to students',
      fi: 'Lisätä tehtäviä oppilaille',
    },
    info_tch_6: {
      en: 'Create visalizations from data of tasks completed by students',
      fi: 'Luoda visualisointeja suoritetuista tehtävistä',
    },
    info_std_1: {
      en: 'List tasks assigned to complete',
      fi: 'Listata suorittamista odottavat tehtävät',
    },
    info_std_2: {
      en: 'Complete assignments',
      fi: 'Tehdä tehtäviä',
    },
    info_std_3: {
      en: 'List completed assignments',
      fi: 'Listata suoritetut tehtävät',
    },

    msg_connecting: {
      en: 'Connecting to database...',
      fi: 'Muodostetaan yhteyttä tietokantaan...',
    },
    msg_test_info: {
      en: 'Tested with',
      fi: 'Testattu selaimilla',
    },
    msg_contact_info: {
      en: 'School rectors and teachers, please contact us directly.',
      fi: 'Pyydämme että rehtorit ja opettajat ottavat meihin suoraan yhteyttä.',
    },
    msg_contact_uta: {
      en: 'University of Tampere',
      fi: 'Tampereen yliopisto',
    },
    msg_request_sent: {
      en: /** @param {string} p1 */ p1 => `The registration request for "${p1}" has been sent.`,
      fi: /** @param {string} p1 */ p1 => `Pyyntä rekisteröidä "${p1}" on lähetetty.`,
    },
    msg_password_reset: {
      en: /** @param {string} p1 */ p1 => `The password reset request has been sent to "${p1}".`,
      fi: /** @param {string} p1 */ p1 => `Salasanan vaihtopyyntä on lähetetty käyttöjälle "${p1}".`,
    },

    tit_registration: {
      en: 'Registration',
      fi: 'Rekisteröinti',
    },
    tit_pass_reset: {
      en: 'Password reset',
      fi: 'Salasanan vaihto',
    },

    err_password_reset: {
      en: /** @param {string} p1 */ p1 => `Cannot send the password reset request to "${p1}".`,
      fi: /** @param {string} p1 */ p1 => `Salasanan vaihtopyynnän lähetys käyttöjälle "${p1}" ei onnistunut.`,
    },

    ws_err_title: {
      en: 'Communication with gaze tracker is blocked by the browser',
      fi: 'Selain estää yhteyden katseenseurantalaitteeseen',
    },
    ws_err_subtitle: {
      en: 'Please enable the communication and reload the page',
      fi: 'Salli yhteys ja lataa sivu uudestaan',
    },
    ws_unblock_1: {
      en: ['Navigate to', 'page. Agree to be careful if the browsers asks you to be so.'],
      fi: ['Navigoi sivulle', '. Lupaa olla varovainen jos selain pyytää sitä.'],
    },
    ws_unblock_2: {
      en: ['Type', 'in the search box.'],
      fi: ['Kirjoita', 'hakuikkunaan.'],
    },
    ws_unblock_3: {
      en: ['If the value of this parameter is', ', then double-click on it to change it to', '.'],
      fi: ['Jos tämän parametrin arvo on', ', kaksoisklikkaa sitä, jolloin arvoksi muuttuu', '.'],
    },
    ws_unblock_4: {
      en: '(search "how to enable websocket over https" for you browser)',
      fi: '(etsi "how to enable websocket over https" selaimessasi)', 
    },
  },

  assignments: {
    msg_removed_account: {
      en: 'This student account was removed from all schools and is considered as frozen. No tasks will be assigned to this account in future.',
      fi: 'Oppilaan tili on suljettu eikä sille voida antaa enää uusia tehtäviä.',
    },
    msg_no_assignments: {
      en: 'No assigned tasks yet',
      fi: 'Ei tehtäviä',
    },
    msg_no_completed: {
      en: 'No completed tasks yet',
      fi: 'Ei tehtäviä',
    },

    hdr_assignments: {
      en: 'Tasks to complete',
      fi: 'Tehtävät',
    },
    hdr_completed: {
      en: 'Completed tasks',
      fi: 'Valmiit tehtävät',
    },
    hdr_wpm: {
      en: 'WPM',
      fi: 'Sanat/Min',
    },

    tit_syllab: {
      en: 'Syllabifications',
      fi: 'Tavutuksia',
    },
    tit_voice: {
      en: 'Voice',
      fi: 'Ääni',
    },
    tit_rec: {
      en: 'Recording',
      fi: 'Äänitallenne',
    },
  },

  assignment: {
    btn_calib: {
      en: 'Calibrate',
      fi: 'Kalibroi',
    },
    btn_skip_calib: {
      en: 'Skip calibration',
      fi: 'Ohita kalibrointi',
    },
    btn_next: {
      en: 'Next',
      fi: 'Seuraava',
    },
    btn_finish: {
      en: 'Finish',
      fi: 'Lopeta',
    },
    btn_thanks: {
      en: 'Thank you!',
      fi: 'Kiitos!',
    },

    msg_tracking_lost: {
      en: 'Gaze tracking is not available',
      fi: 'Katseenseuranta ei ole käytettävissä',
    },
    msg_tracker_not_calibrated: {
      en: 'The tracker is not calibrated yet',
      fi: 'Katseenseurantaa ei ole vielä kalibroitu',
    },
    msg_calib_window_not_visible: {
      en: 'If you pressed CALIBRATE and calibration window is not visible, please minimize the browser: the calibration window is located below it.',
      fi: 'Jos valitsit KALIBROI ja kalibrointi-ikkuna ei ole näkyvissä, minimoi selaimen ikkuna: kalibrointi-ikkuna on sen alla.',
    },
    hdr_cannot_conect: {
      en: 'Cannot connect to a gaze tracker',
      fi: 'Katseenseurannan yhdistäminen ei onnistu',
    },
    msg_cannot_conect_1: {
      en: 'Possible reasons:',
      fi: 'Mahdollisia syitä:',
    },
    msg_cannot_conect_2: {
      en: 'ETU-Driver service is not running',
      fi: 'ETU-Driver service ei ole käynnissä',
    },
    msg_cannot_conect_3: {
      en: 'ETU-Driver service is running, but its WebSocket server is not enabled',
      fi: 'ETU-Driver service on käynnissä, mutta sen WebSocket serveriä ei ole sallittu',
    },
  },

  modal_error: {
    title: {
      en: 'Assignment error',
      fi: 'Tehtävän liittämisvirhe',
    },
  },

  teachers: {
    hdr_new: {
      en: 'Add teacher',
      fi: 'Uusi opettaja',
    },

    msg_no_teachers: {
      en: 'No teachers exists yet',
      fi: 'Opettajia ei ole vielä olemassa',
    },
    msg_moved: {
      en: 'The teacher was moved to another school',
      fi: 'Opettaja siirrettiin toiseen kouluun',
    },

    err_exists: {
      en: 'A teacher with this email exists already',
      fi: 'Opettaja, jolla on tämä osoite, on jo olemassa',
    },
    err_move: {
      en: 'Failed to move the teacher to another school',
      fi: 'Opettajan siirto toiseen kouluun ei onnistunut',
    },
  },

  students: {
    hdr_new: {
      en: 'New student',
      fi: 'Uusi oppilas',
    },

    msg_no_students: {
      en: 'No students exists yet',
      fi: 'Ei vielä oppilaita',
    },
    msg_moved: {
      en: 'The student was moved to another school',
      fi: 'Oppilas siirrettiin toiseen kouluun',
    },

    err_load_teacher: {
      en: 'Failed to load teacher\'s school',
      fi: 'Opettajan koulun lataus ei onnistunut',
    },
    err_exists: {
      en: 'A student with this email or ID exists already',
      fi: 'Oppilas, jolla on sama osoite tai tunnus, on jo olemassa',
    },
    err_move: {
      en: 'Failed to move the student to another school',
      fi: 'Oppilaan siirto toiseen kouluun ei onnistunut',
    },
    err_access_school: {
      en: 'Failed to access the student school',
      fi: 'Oppilaan kouluun ei saatu yhteyttä',
    },
  },

  instructions: {
    hdr_new: {
      en: 'New instruction',
      fi: 'Uusi ohje',
    },
    hdr_editor: {
      en: 'Instruction editor',
      fi: 'Ohjeiden muokkaus',
    },

    msg_no_instructions: {
      en: 'No instructions exists yet',
      fi: 'Ohjeita ei vielä olemassa',
    },

    err_exists: {
      en: 'An instructions of this name exists already',
      fi: 'Tämän niminen ohje on jo olemassa',
    },

    tit_edit: {
      en: 'Edit instruction',
      fi: 'Muokkaa ohjetta',
    },
    tit_delete: {
      en: 'Delete instruction',
      fi: 'Poista ohje',
    },
  },

  instruction_editor: {
    hdr_texts: {
      en: 'Texts',
      fi: 'Tekstit',
    },

    msg_instruction_invalid: {
      en: 'instruction is too short',
      fi: 'ohje on liian lyhyt',
    },

    ph_calib_inst: {
      en: 'Calibration instruction',
      fi: 'Kalibrointiohje',
    },
    ph_start_inst: {
      en: 'Start instruction',
      fi: 'Aloitusohje',
    },
    ph_first_page: {
      en: 'First page',
      fi: 'Ensimmäinen sivu',
    },
  },

  classes: {
    hdr_new: {
      en: 'New class',
      fi: 'Uusi luokka',
    },

    tit_delete_class: {
      en: 'Delete the class',
      fi: 'Poista luokka',
    },

    err_name_exists: {
      en: 'A class of this name exists already',
      fi: 'Tämän niminen luokka on jo olemassa',
    },
  },

  task_list: {
    btn_new: {
      en: 'Create new',
      fi: 'Luo uusi',
    },

    lbl_pages: {
      en: /** @param {any} p1 */ p1 => `${p1} pages`,
      fi: /** @param {any} p1 */ p1 => `${p1} sivua`,
    },

    tit_edit: {
      en: /** @param {boolean} p1 */ p1 => p1 ? 'This task has recorded sessions' : 'Edit the task',
      fi: /** @param {boolean} p1 */ p1 => p1 ? 'Tätä tehtävää on jo suoritettu' : 'Muokkaa tehtävää',
    },
    tit_copy: {
      en: 'Create a new task from the existing',
      fi: 'Luo uusi tehtävä vanhan perusteella',
    },
    tit_delete: {
      en: 'Delete the task',
      fi: 'Poista tehtävä',
    },

    msg_delete_warning: {
      en: 'All students assignments completed on this task will be deleted as well',
      fi: 'Myös kaikki tämän tehtävän suoritukset poistetaan',
    },
    msg_cancel_warning: {
      en: 'All changes will be lost. OK to continue?',
      fi: 'Muutoksia ei talletata. Jatketaanko?',
    },

    hdr_editor: {
      en: /** @param {any} p1 */ p1 => `Task editor${p1}`,
      fi: /** @param {any} p1 */ p1 => `Tehtävien muokkaus${p1}`,
    },

    err_same_name: {
      en: 'A task with the same name exists already',
      fi: 'Tämän niminen tehtävä on jo olemassa',
    },
  },

  student_list: {
    lbl_add: {
      en: 'Add an assignment',
      fi: 'Lisää tehtävä',
    },

    tit_remove: {
      en: 'Remove the student from this class',
      fi: 'Poista oppilas tästä luokasta',
    },
    tit_students: {
      en: 'Available students',
      fi: 'Mahdolliset oppilaat',
    },

    data_grade: {
      en: 'grade',
      fi: 'luokka-aste',
    },
    data_student: {
      en: 'student',
      fi: 'oppilas',
    },

    err_load_school: {
      en: 'Failed to load the teacher\'s school',
      fi: 'Opettajan koulun lataus ei onnistunut',
    },
    err_load_school_students: {
      en: 'Failed to load the school\'s students',
      fi: 'Koulun oppilaiden lataus ei onnistunut',
    },
    err_add_assig: {
      en: 'Failed to assign the task',
      fi: 'Tehtävän lisäys oppilaalle ei onnistunut',
    },
    err_remove_assig: {
      en: 'Failed to remove the assignment',
      fi: 'Tehtävän poisto ei onnistunut',
    },

    msg_students_added: {
      en: 'Students were added',
      fi: 'Oppilaat lisättiin',
    },
    msg_assig_added: {
      en: 'The task was assigned',
      fi: 'Tehtävä lisättiin oppilaalle',
    },
    msg_assig_removed: {
      en: 'The assignment was removed',
      fi: 'Tehtävä poistettiin oppilaalta',
    },
  },

  remove_warning: {
    header: {
      en: /** @param {any} p1 */ p1 => `Deleting ${p1}`,
      fi: /** @param {any} p1 */ p1 => `Poistetaan ${p1}`,
    },
    warning: {
      en: /** @param {any} p1 @param {any} p2 */ (p1, p2) => `The ${p1} "${p2}" will be deleted permanently`,
      fi: /** @param {any} p1 @param {any} p2 */ (p1, p2) => `${p1} "${p2}" poistetaan pysyvästi`, //TO VALIDATE
    },
    continue: {
      en: 'Continue?',
      fi: 'Jatketaanko?',
    },
  },

  task_editor: {
    btn_preview: {
      en: 'Preview',
      fi: 'Esikatselu',
    },
    btn_set_default: {
      en: 'Set as default',
      fi: 'Muuta oletukseksi',
    },

    lbl_use_timeout: {
      en: 'Use timeout:',
      fi: 'Aikakatkaisu:',
    },
    lbl_minute: {
      en: 'min.',
      fi: 'min.',
    },
    lbl_record_audio: {
      en: 'Record audio',
      fi: 'Äänitä',
    },

    lbl_alignment: {
      en: 'Alignment',
      fi: 'Tasaus',
    },
    lbl_font: {
      en: 'Font',
      fi: 'Kirjasin',
    },
    lbl_formatting: {
      en: 'Formatting',
      fi: 'Muotoilu',
    },

    item_center: {
      en: 'center',
      fi: 'keskelle',
    },
    item_left: {
      en: 'left',
      fi: 'vasemmalle',
    },
    item_none: {
      en: 'none',
      fi: 'ei mitään',
    },

    msg_not_editable: {
      en: 'The task contains images bound to words and therefore its text cannot be modified.',
      fi: 'Tehtävässä on sanoihin sidottuja kuvia ja siksi sen tekstiä ei voi muokata.',
    },
  },

  task_editor_feedback: {
    lbl_speech: {
      en: 'Speech',
      fi: 'Puhe',
    },
    lbl_syllab: {
      en: 'Syllabification',
      fi: 'Tavutus',
    },
    lbl_highlight: {
      en: 'Highlighting',
      fi: 'Highlighting',   // TODO - translate
    },
    lbl_syllabs: {
      en: 'Syllabifications',
      fi: 'Tavutukset',
    },
    lbl_temp: {
      en: 'temporary',
      fi: 'hetkellinen',
    },
    lbl_word: {
      en: 'word-length dependent',
      fi: 'sanan pituudesta riippuva',
    },
    lbl_exceptions: {
      en: 'Exceptions',
      fi: 'Poikkeukset',
    },
    lbl_example: {
      en: 'Example: maailma=maa il ma',
      fi: 'Esimerkki: maailma=maa il ma',
    },
    lbl_enabled: {
      en: 'Enabled',
      fi: 'Enabled',  // TODO - translate
    },

    item_none: {
      en: 'none',
      fi: 'ei käytössä',
    },
    item_fixed: {
      en: 'fixed',
      fi: 'kiinteä',
    },
    item_calib: {
      en: 'calibrated',
      fi: 'kalibroitu',
    },
    item_colors: {
      en: 'colors',
      fi: 'värit',
    },
    item_hyphen: {
      en: 'hyphen',
      fi: 'tavuviiva',
    },
  },

  task_editor_images: {
    lbl_preview: {
      en: 'Preview',
      fi: 'Esikatselu',
    },
    lbl_page: {
      en: 'Page',
      fi: 'Sivu',
    },
    lbl_location: {
      en: 'Location',
      fi: 'Paikka',
    },
    lbl_size: {
      en: 'Size',
      fi: 'Koko',
    },
    lbl_on: {
      en: 'On',
      fi: 'Käytössä',
    },
    lbl_off: {
      en: 'Off',
      fi: 'Ei käytössä',
    },
    lbl_keep_size: {
      en: /** @param {boolean} p1 */ p1 => p1 ? 'original' : 'shrinked',
      fi: /** @param {boolean} p1 */ p1 => p1 ? 'alkuperäinen' : 'pienennetty',
    },
    lbl_bytes: {
      en: 'bytes',
      fi: 'tavua',
    },
    lbl_pixels: {
      en: 'pixels from',
      fi: 'pikseliä',
    },
    lbl_show: {
      en: 'Show',
      fi: 'Näytä',
    },
    lbl_at: {
      en: 'at',
      fi: 'sanassa',
    },
    lbl_longer: {
      en: 'longer than',
      fi: 'yli',
    },
    lbl_hide: {
      en: 'Hide',
      fi: 'Piilota',
    },
    lbl_seconds: {
      en: 'seconds',
      fi: 'sekuntia',
    },

    msg_no_images: {
      en: 'No images',
      fi: 'Ei kuvia',
    },
    msg_choose: {
      en: 'Choose an image…',
      fi: 'Valitse kuva…',
    },
    msg_drag: {
      en: 'or drag it here',
      fi: 'tai raahaa se tähän',
    },
    msg_fix_on_word: {
      en: 'fixation on word',
      fi: 'fiksaatio sanassa', //TO VALIDATE
    },

    tit_params: {
      en: 'Edit the image appearance parameters',
      fi: 'Muokkaa kuvan esityksen parametreja',
    },
    tit_remove: {
      en: 'Remove the image',
      fi: 'Poista kuva',
    },

    item_any: {
      en: 'any',
      fi: 'kaikki',
    },
    item_left: {
      en: 'left',
      fi: 'vasemmalta',
    },
    item_bottom: {
      en: 'bottom',
      fi: 'alareunasta',
    },
    item_right: {
      en: 'right',
      fi: 'oikealta',
    },
    item_original: {
      en: 'original',
      fi: 'alkuperäinen',
    },
    item_15: {
      en: '15% of width / height',
      fi: '15% alkuperäisestä',
    },
    item_initially: {
      en: 'initially',
      fi: 'heti',
    },
    item_on_fix: {
      en: 'on fixation',
      fi: 'fiksaatiolle',
    },
    item_never: {
      en: 'never',
      fi: 'ei koskaan',
    },
    item_when_other: {
      en: 'when other image is shown',
      fi: 'kun toinen kuva näytetään',
    },
    item_after: {
      en: 'after',
      fi: 'kun on kulunut',
    },

    btn_upload: {
      en: 'Upload',
      fi: 'Lataa',
    },

    err_image_type: {
      en: 'Only JPEG and PNG images are supported',
      fi: 'Vain JPEG ja PNG kuvat sallitaan',
    },
    err_image_size: {
      en: 'File size must not exceed 100 kB',
      fi: 'Tiedoston koko saa olla enintään 100 kB',
    },
    err_upload: {
      en: 'Cannot upload the file',
      fi: 'Tiedoston lataus ei onnistu',
    },
  },

  task_editor_quest: {
    lbl_for: {
      en: 'For',
      fi: 'Kysytään',
    },
    lbl_text: {
      en: 'Text',
      fi: 'Teksti',
    },

    item_text: {
      en: 'whole text',
      fi: 'tekstin lopussa',
    },
    item_word: {
      en: 'long-gazed word',
      fi: 'jos sanaa on katsottu kauan',
    },

    ph_word: {
      en: 'Word',
      fi: 'Sana',
    },
    ph_question: {
      en: 'Question',
      fi: 'Kysymys',
    },
    ph_answer: {
      en: 'answer',
      fi: 'vastaus',
    },
  },

  task_text_format: {
    rules: {
      en: 'Rules',
      fi: 'Säännöt',
    },
    empty_line: {
      en: 'Empty line',
      fi: 'Tyhjä rivi',
    },
    separator: {
      en: 'page separator',
      fi: 'erottaa sivut',
    },
    styles: {
      en: 'applies comma-separated styles listed afterward for',
      fi: 'edeltää pilkulla erotettuja muotoiluohjeita',
    },
    word: {
      en: 'a word',
      fi: 'sanalle',
    },
    line: {
      en: 'a line',
      fi: 'riville',
    },
    lighter: {
      en: '25% lighter than the normal text',
      fi: '25% vaaleampi kuin tekstin oletusväri',
    },
    darker: {
      en: '25% darker than the normal text',
      fi: '25% tummempi kuin tekstin oletusväri',
    },
    color: {
      en: 'font color',
      fi: 'tekstin väri',
    },
    size: {
      en: 'font size',
      fi: 'tekstikoko',
    },
    style: {
      en: 'font style',
      fi: 'tekstin kursivointi',
    },
    weight: {
      en: 'font weight',
      fi: 'tekstin lihavointi',
    },
    example: {
      en: 'Example',
      fi: 'Esimerkki',
    },
  },

  selection_box: {
    lbl_select: {
      en: /** @param {any} p1 */ p1 => `Select a ${p1}`,
      fi: /** @param {any} p1 */ p1 => `Valitse ${p1}`,
    },
    lbl_no_avail: {
      en: /** @param {any} p1 */ p1 => `Not available ${p1}`,
      fi: /** @param {any} p1 */ p1 => `${p1} ei käytettävissä`,
    },

    btn_select: {
      en: 'Select',
      fi: 'Valitse',
    },
    btn_select_all: {
      en: 'Select all',
      fi: 'Valitse kaikki',
    },
    btn_remove_all: {
      en: 'Remove all selections',
      fi: 'Poista kaikki valinnat',
    },
  },

  preview: {
    lbl_syllab_word: {
      en: 'Ctrl + click on a word to syllabify it',
      fi: 'Ctrl + click sanan kohdalla tavuttaa sen',
    },
    lbl_speak_word: {
      en: 'Alt + click on a word to pronounce it',
      fi: 'Alt + click sanan kohdalla puhuu sanan ääneen',
    },

    btn_syllab_all: {
      en: 'Syllabify all',
      fi: 'Tavuta kaikki',
    },
    btn_close: {
      en: 'Close',
      fi: 'Sulje',
    },
  },

  results: {
    msg_no_data: {
      en: 'No data was recorded yet',
      fi: 'Dataa ei vielä ole tallennettu',
    },

    btn_durations: {
      en: 'Durations',
      fi: 'Kestot',
    },
    btn_gaze_plot: {
      en: 'Gaze plot',
      fi: 'Katsepolku',
    },
    btn_gaze_replay: {
      en: 'Gaze replay',
      fi: 'Katsepolun toisto',
    },
    btn_audio_replay: {
      en: 'Audio replay',
      fi: 'Äänityksen toisto',
    },
    btn_word_replay: {
      en: 'Word replay',
      fi: 'Sanataulukko',
    },
    btn_questionnaire: {
      en: 'Questionnaire',
      fi: 'Kyselytulokset',
    },
    btn_summary: {
      en: 'Summary',
      fi: 'Yhteenveto',
    },
    btn_edit: {
      en: 'Edit',
      fi: 'Muokkaa',
    },

    data_grade: {
      en: 'grade',
      fi: 'luokka-aste',
    },
    data_student: {
      en: 'student',
      fi: 'oppilas',
    },
    data_session: {
      en: 'session',
      fi: 'suoritus',
    },

    tit_sessions: {
      en: /** @param {any} p1 */ p1 => `Sessions by ${p1}`,
      fi: /** @param {any} p1 */ p1 => `Oppilaan ${p1} suoritukset`,
    },
    tit_students: {
      en: /** @param {any} p1 */ p1 => `Students completed "${p1}"`,
      fi: /** @param {any} p1 */ p1 => `Tehtävän "${p1}" suorittaneet`,
    },
    tit_students_of: {
      en: /** @param {any} p1 */ p1 => `students of "${p1}"`,
      fi: /** @param {any} p1 */ p1 => `luokan "${p1}" oppilaat`,
    },

    err_load_classes: {
      en: 'Failed to load classes',
      fi: 'Luokkien lataus ei onnistunut',
    },
    err_load_student: {
      en: 'Failed to load student data',
      fi: 'Oppilaan datojen lataus ei onnistunut',
    },
  },

  session_box: {
    err_delete: {
      en: 'Failed to delete the session',
      fi: 'Suorituksen lataus ei onnistunut',
    },
  },

  audio: {
    play: {
      en: 'Play',
      fi: 'Toista',
    },
    pause: {
      en: 'Pause',
      fi: 'Pysäytä',
    },
  },

  control_panel: {
    tit_speech: {
      en: 'Speech output',
      fi: 'Äänivihjeet käytössä',
    },
    tit_syllab: {
      en: 'Syllabification',
      fi: 'Tavutus käytössä',
    },
    tit_quest: {
      en: 'Questionnaire correctness',
      fi: 'Kysely käytössä',
    },
    tit_prev: {
      en: 'Previous page',
      fi: 'Edellinen sivu',
    },
    tit_next: {
      en: 'Next page',
      fi: 'Seuraava sivu',
    },
    tit_settings: {
      en: 'Settings',
      fi: 'Asetukset',
    },
    tit_close: {
      en: 'Close this visualization',
      fi: 'Sulje tämä visualisointi',
    },

    lbl_intro: {
      en: 'intro',
      fi: 'intro',
    },
  },

  vis: {
    hdr_commons: {
      en: 'Common',
      fi: 'Yleiset',
    },
    hdr_reading: {
      en: /** @param {string} p1 @param {string} p2 @param {string} p3 */ (p1, p2, p3) => 
        `${p1} reading "${p2}" at ${p3}`,
      fi: /** @param {string} p1 @param {string} p2 @param {string} p3 */ (p1, p2, p3) => 
        `${p1} tehtävässä "${p2}" kello ${p3}`,
    },
    hdr_quest: {
      en: /** @param {string} p1 */ p1 => `Questionnaire results in "${p1}"`,
      fi: /** @param {string} p1 */ p1 => `Kyselytulokset tehtävässä "${p1}"`,
    },
    hdr_missing_data: {
      en: 'Missing data',
      fi: 'Data puuttuu',
    },
    hdr_total: {
      en: 'Total',
      fi: 'Yhteensä',
    },

    lbl_text_color: {
      en: 'Text color',
      fi: 'Tekstin väri',
    },
    lbl_hl_color: {
      en: 'Highlighting color',
      fi: 'Korostusväri',
    },
    lbl_frame_color: {
      en: 'Word frame color',
      fi: 'Sanan kehysväri',
    },
    lbl_draw_frame: {
      en: 'Draw word frame',
      fi: 'Piirrä sanoille kehys',
    },
    lbl_word_color: {
      en: 'Word color metric',
      fi: 'Sanojen väritysperuste',
    },
    lbl_syllab_back: {
      en: 'Syllabification background',
      fi: 'Tavutetun sanan tausta',
    },
    lbl_syllab_word: {
      en: 'Syllabification word color',
      fi: 'Tavutetun sanan väri',
    },

    msg_missing_data: {
      en: 'Fixation data is missing on this page',
      fi: 'Tällä sivulla ei ole katsedataa',
    },

    item_none: {
      en: 'none',
      fi: 'ei käytössä',
    },
    item_dur: {
      en: 'duration',
      fi: 'kesto',
    },
    item_char: {
      en: 'char speed',
      fi: 'nopeus (merkkiä)',
    },
    item_focus: {
      en: 'focus count',
      fi: 'lukukertojen määrä',
    },
  },

  vis_gaze_plot: {
    hdr_options: {
      en: 'Gaze Plot',
      fi: 'Katsepolku',
    },

    lbl_sacc_color: {
      en: 'Saccade color',
      fi: 'Sakkaadien väri',
    },
    lbl_reg_sacc_color: {
      en: 'Regressive saccade color',
      fi: 'Regressioiden väri',
    },
    lbl_show_conn: {
      en: 'Show word-fixation connections',
      fi: 'Näytä sana-fiksaatio viivat',
    },
    lbl_show_sacc: {
      en: 'Show saccades',
      fi: 'Näytä sakkaadit',
    },
    lbl_show_fix: {
      en: 'Show fixations',
      fi: 'Näytä fiksaatiot',
    },
  },

  vis_durations: {
    hdr_dur: {
      en: /** @param {string} p1 @param {string} p2 */ (p1, p2) =>
        `Word reading durations in "${p2}"${p1 ? ' for ' + p1 : ''}`,
      fi: /** @param {string} p1 @param {string} p2 */ (p1, p2) => 
        `Sanojen lukuajat tehtävässä "${p2}"${p1 ? ' oppilaalle ' + p1 : ''}`,
    },
    hdr_options: {
      en: 'Durations',
      fi: 'Kestot', 
    },

    item_seconds: {
      en: 'seconds',
      fi: 'sekuntia', 
    },
    item_percentage: {
      en: 'percentage',
      fi: 'prosenttia',
    },
    item_ms_char: {
      en: 'ms/char',
      fi: 'ms/kirje',
    },

    lbl_units: {
      en: 'Units',
      fi: 'Yksiköt',
    },
  },

  vis_word_replay: {
    hdr_word_replay: {
      en: /** @param {string} p1 @param {string} p2 */ (p1, p2) =>
        `Word replay in "${p2}"${p1 ? ' for ' + p1 : ''}`,
      fi: /** @param {string} p1 @param {string} p2 */ (p1, p2) =>
        `Sanataulukko tehtävässä "${p2}"${p1 ? ' oppilaalle ' + p1 : ''}`,
    },
    hdr_options: {
      en: 'Word replay',
      fi: 'Sanataulukko',
    },

    lbl_done: {
      en: 'done',
      fi: 'valmis',
    },
    lbl_no_data: {
      en: 'no data',
      fi: 'ei dataa',
    },
    lbl_level_dur: {
      en: 'Level duration',
      fi: 'Tason kesto',
    },
  },

  vis_gaze_replay: {
    lbl_font: {
      en: 'Name font',
      fi: 'Nimen fontti',
    },
    lbl_font_size: {
      en: 'Name font size',
      fi: 'Nimen fonttikoko',
    },
    lbl_spacing: {
      en: 'Name spacing',
      fi: 'Nimen rivinväli',
    },

    hdr_gaze_replay: {
      en: /** @param {string} p1 @param {string} p2 */ (p1, p2) =>
        `Gaze replay in "${p2}"${p1 ? ' for ' + p1 : ''}`,
      fi: /** @param {string} p1 @param {string} p2 */ (p1, p2) =>
        `Katsepolun toisto tehtävässä "${p2}"${p1 ? ' oppilaalle ' + p1 : ''}`,
    },
    hdr_options: {
      en: 'Gaze Replay',
      fi: 'Katsepolun toisto',
    },
  },

  vis_summary: {
    tit_wpm: {
      en: 'Words per minute',
      fi: 'Sanoja minuutissa',
    },
    tit_sylpm: {
      en: 'Syllables per minute (sessions)',
      fi: 'Tavuja minuutissa (suorituksia)',
    },
    tit_spw: {
      en: 'Seconds per word',
      fi: 'Sekuntia per sana',
    },
    tit_fd: {
      en: 'Average fixation duration in milliseconds',
      fi: 'Fiksaation kesto keskimäärin (millisekuntia)',
    },
    tit_fsd: {
      en: 'Fixation standard deviation in milliseconds',
      fi: 'Fiksaatioiden keston keskihajonta (millisekuntia)',
    },
    tit_syllabs: {
      en: 'Syllabifications',
      fi: 'Tavutuksia',
    },
    tit_regrs: {
      en: 'Regressions',
      fi: 'Regressioita',
    },

    lbl_time: {
      en: 'Reading time',
      fi: 'Lukuaika',
    },
    lbl_wpm: {
      en: 'WPM',
      fi: 'WPM',
    },
    lbl_spm: {
      en: 'SPM',
      fi: 'SPM',
    },
    lbl_spw: {
      en: 'SPW',
      fi: 'SPW',
    },
    lbl_fix: {
      en: 'Fixation',
      fi: 'Fiksaatio',
    },
    lbl_fsd: {
      en: 'FSD',
      fi: 'FSD',
    },
  },

  player: {
    tit_restart: {
      en: 'Restart',
      fi: 'Käynnistä alusta',
    },
    tit_pause_cont: {
      en: 'Pause / Continue',
      fi: 'Pysäytä / Jatka',
    },
  },

  options: {
    hdr_settings: {
      en: 'Settings',
      fi: 'Asetukset',
    },

    btn_apply: {
      en: 'Apply',
      fi: 'Käytä',
    },
    btn_save_close: {
      en: 'Save and close',
      fi: 'Tallenna ja sulje',
    },
    btn_reset: {
      en: 'Reset',
      fi: 'Palauta',
    },
  },

  sgwm: {
    hdr_data_map: {
      en: 'Data mapping',
      fi: 'Datan tulkinta',
    },
    hdr_fix_proc: {
      en: 'Fixation processing',
      fi: 'Fiksaatioiden käsittely',
    },
    hdr_splitter: {
      en: 'Splitter',
      fi: 'Alue',
    },
    hdr_merger: {
      en: 'Merger',
      fi: 'Yhdistäminen',
    },
    hdr_word_map: {
      en: 'Word mapper',
      fi: 'Liittäminen sanoihin',
    },

    lbl_loc: {
      en: 'By location',
      fi: 'Paikan perusteella',
    },
    lbl_dur: {
      en: 'By duration',
      fi: 'Keston perusteella',
    },
    lbl_margin: {
      en: /** @param {string} p1 */ p1 => `margin ${p1}, px`,
      fi: /** @param {string} p1 */ p1 => `${p1}-marginaali, px`,
    },
    lbl_merge_th: {
      en: 'merging threshold, ms',
      fi: 'yhdistämisen kynnysarvo, ms',
    },
    lbl_merge_dist: {
      en: 'merging distance, px',
      fi: 'yhdistämisetäisyys, px',
    },
    lbl_min_dur: {
      en: 'min duration, ms',
      fi: 'vähimmäiskesto, ms',
    },

    lbl_left_margin: {
      en: 'Left margin, chars',
      fi: 'Vasen reuna, merkkiä',
    },
    lbl_right_margin: {
      en: 'Right margin, chars',
      fi: 'Oikea reuna, merkkiä',
    },
    lbl_v_margin_char: {
      en: 'Vertical margin, chars',
      fi: 'Vertikaaliero, merkkiä',
    },
    lbl_v_margin_lines: {
      en: 'Vertical margin, lines',
      fi: 'Vertikaaliero, rivejä',
    },
    lbl_incline: {
      en: 'Max incline, rad',
      fi: 'Enimmäiskulma, astetta',
    },

    lbl_short_prog: {
      en: 'Shortest progression, fixations',
      fi: 'Fiksaatioita vähintään',
    },
    lbl_line_sep: {
      en: 'Line separation threshold, lines',
      fi: 'Rivivälin kynnysarvo, rivejä',
    },
    lbl_line_incline: {
      en: 'Max line incline, rad',
      fi: 'Rivin enimmäiskulma, astetta',
    },
    lbl_remove_fix: {
      en: 'Remove unmerged single fixations',
      fi: 'Poista yhdistämättämät yksittäiset fiksaatiot',
    },
    lbl_empty_lines: {
      en: 'Account for empty lines',
      fi: 'Käsittele tyhjät rivit',
    },
    lbl_support_line: {
      en: 'support current line by',
      fi: 'nykyisen rivin painokerroin',
    },
    lbl_empty_line: {
      en: 'empty line factor, lines',
      fi: 'tyhjien rivien kerroin, rivejä',
    },
    lbl_first_line: {
      en: 'Intelligent first reading line search',
      fi: 'Salli ensimmäisen rivin poikkeuskäsittely',
    },

    lbl_skip_start: {
      en: 'Skip from start, chars',
      fi: 'Alusta ohitettavia merkkejä',
    },
    lbl_skip_end: {
      en: 'Skip from end, chars',
      fi: 'Lopusta ohitettavia merkkejä',
    },
    lbl_scale: {
      en: 'Scaling diff limit',
      fi: 'Skaalausraja',
    },
    lbl_rescale: {
      en: 'Rescale fixations horizontally',
      fi: 'Skaalaa fiksaatiot uudelleen vaakasuunnassa',
    },
    lbl_short_word: {
      en: 'short word, chars',
      fi: 'lyhyet sanat, merkkejä',
    },
    lbl_limit: {
      en: 'limit to',
      fi: 'enintään',
    },
    lbl_ignore_trans: {
      en: 'Ignore transitions',
      fi: 'Älä huomioi siirtymiä',
    },
  },

  _utils: {
    num_student: {
      en: /** @param {[]} p1 */ p1 => (p1 && p1.length) ? p1.length + ' student' + (p1.length !== 1 ? 's' : '') : 'No students',
      fi: /** @param {[]} p1 */ p1 => (p1 && p1.length) ? p1.length + ' oppilas' + (p1.length !== 1 ? 'ta' : '') : 'Ei oppilaita',
    },
    num_task: {
      en: /** @param {[]} p1 */ p1 => (p1 && p1.length) ? p1.length + ' task' + (p1.length !== 1 ? 's' : '') : 'No tasks',
      fi: /** @param {[]} p1 */ p1 => (p1 && p1.length) ? p1.length + ' tehtävä' + (p1.length !== 1 ? 'ä' : '') : 'Ei tehtäviä',
    },
  },

  _buttons: {
    manual: {
      en: 'Manual',
      fi: 'Ohjesivut',
    },
    create: {
      en: 'Create',
      fi: 'Luo',
    },
    save: {
      en: 'Save',
      fi: 'Tallenna',
    },
    ok: {
      en: 'OK',
      fi: 'OK',
    },
    cancel: {
      en: 'Cancel',
      fi: 'Peruuta',
    },
    add: {
      en: 'Add',
      fi: 'Lisää',
    },
    start: {
      en: 'Start',
      fi: 'Aloita',
    },
  },

  _form: {
    name: {
      en: 'Name',
      fi: 'Nimi',
    },
    email: {
      en: 'Email',
      fi: 'Sähköposti',
    },
    email_id: {
      en: 'Email or ID',
      fi: 'Sähköposti tai tunnus',
    },
    password: {
      en: 'Password',
      fi: 'Salasana',
    },

    name_invalid: {
      en: 'name is too short',
      fi: 'nimi on liian lyhyt',
    },
    email_invalid: {
      en: 'email is not valid',
      fi: 'sähköposti on väärässä muodossa',
    },
    password_invalid: {
      en: 'password is too short',
      fi: 'salasana on liian lyhyt',
    },
  },

  _labels: {
    admin: {
      en: 'admin',
      fi: 'ylläpitäjä',
    },
    school: {
      en: 'School',
      fi: 'Koulu',
    },
    schools: {
      en: 'Schools',
      fi: 'Koulut',
    },
    teacher: {
      en: 'Teacher',
      fi: 'Opettaja',
    },
    teachers: {
      en: 'Teachers',
      fi: 'Opettajat',
    },
    student: {
      en: 'Student',
      fi: 'Oppilas',
    },
    students: {
      en: 'Students',
      fi: 'Oppilaat',
    },
    instruction: {
      en: 'Instruction',
      fi: 'Ohje',
    },
    instructions: {
      en: 'Instructions',
      fi: 'Ohjeet',
    },
    class: {
      en: 'Class',
      fi: 'Luokka',
    },
    classes: {
      en: 'Classes',
      fi: 'Luokat',
    },
    grade: {
      en: 'Grade',
      fi: 'Luokka-aste',
    },
    task: {
      en: 'Task',
      fi: 'Tehtävä',
    },
    tasks: {
      en: 'Tasks',
      fi: 'Tehtävät',
    },
    actions: {
      en: 'Actions',
      fi: 'Toimenpiteet',
    },
    text: {
      en: 'Text',
      fi: 'Teksti',
    },
    image: {
      en: 'Image',
      fi: 'Kuva',
    },
    images: {
      en: 'Images',
      fi: 'Kuvat',
    },
    assignments: {
      en: 'Assignments',
      fi: 'Tehtävät',
    },
    sessions: {
      en: 'Sessions',
      fi: 'Suoritukset',
    },
    date: {
      en: 'Date',
      fi: 'Aika',
    },
    feedback: {
      en: 'Feedback',
      fi: 'Palaute',
    },
    questionnaire: {
      en: 'Questionnaire',
      fi: 'Kysely',
    },
  },

  _failures: {
    load: {
      en: /** @param {string} p1 */ p1 => `Failed to load ${p1.toLowerCase()}`,
      fi: /** @param {string} p1 */ p1 => `Lataus epäonnistui: ${p1.toLowerCase()}`,
    },
    create_new: {
      en: /** @param {string} p1 */ p1 => `Failed to create ${p1.toLowerCase()}`,
      fi: /** @param {string} p1 */ p1 => `Luonti epäonnistui: ${p1.toLowerCase()}`,
    },
    add_new: {
      en: /** @param {string} p1 */ p1 => `Failed to add a new ${p1.toLowerCase()}`,
      fi: /** @param {string} p1 */ p1 => `Ei voitu luoda uutta: ${p1.toLowerCase()}`,
    },
    update: {
      en: /** @param {string} p1 */ p1 => `Failed to update the ${p1.toLowerCase()}`,
      fi: /** @param {string} p1 */ p1 => `Ei voitu päivittää: ${p1.toLowerCase()}`,
    },
    delete: {
      en: /** @param {string} p1 */ p1 => `Failed to delete the ${p1.toLowerCase()}`,
      fi: /** @param {string} p1 */ p1 => `Ei voitu poistaa: ${p1.toLowerCase()}`,
    },
    remove: {
      en: /** @param {string} p1 */ p1 => `Failed to remove the ${p1.toLowerCase()}`,
      fi: /** @param {string} p1 */ p1 => `Ei voitu poistaa: ${p1.toLowerCase()}`,
    },

    added: {
      en: /** @param {string} p1 */ p1 => `The ${p1.toLowerCase()} was added`,
      fi: /** @param {string} p1 */ p1 => `${p1} lisättiin`,
    },
    created: {
      en: /** @param {string} p1 */ p1 => `The ${p1.toLowerCase()} was created`,
      fi: /** @param {string} p1 */ p1 => `${p1} luotiin`,
    },
    updated: {
      en: /** @param {string} p1 */ p1 => `The ${p1.toLowerCase()} was updated`,
      fi: /** @param {string} p1 */ p1 => `${p1} päivitettiin`,
    },
    deleted: {
      en: /** @param {string} p1 */ p1 => `The ${p1.toLowerCase()} was deleted`,
      fi: /** @param {string} p1 */ p1 => `${p1} poistettiin`,
    },
    removed: {
      en: /** @param {string} p1 */ p1 => `The ${p1.toLowerCase()} was removed`,
      fi: /** @param {string} p1 */ p1 => `${p1} poistettiin`,
    },
  },
};

// proxy handler is needed only to detect incorrect queries (items that are missing) to "repos" object
function proxyHandler( repoNames ) {
  return {
    get( obj, prop ) {
      if (!(prop in obj) && typeof prop === 'string' && prop != '_isVue') {
        console.error( `[i10n] ${prop} not in ${repoNames}` );
      }
      return obj[ prop ];
    }
  };
}

export let langs = [ 'en', 'fi' ];

/**
 * @param {string[]} repoNames 
 * @returns {Object.<string,string>}
 */
export function i10n( ...repoNames ) {
  /** @type {Object.<string,string>} */
  const result = {};

  let lang = db.user ? db.user.prefs.lang : 'en';

  lang = lang.toLowerCase();
  if (langs.indexOf( lang ) < 0) {
    lang = langs[0];
  }

  repoNames.forEach( name => {
    /** @type {Object.<string,any>} */
    const repo = repos[ name ];
    if (repo) {
      for (let token in repo) {
        result[ token ] = repo[ token ][ lang ];
      }
    }
  });

  return new Proxy( result, proxyHandler( repoNames ) );
}
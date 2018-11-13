export default class WordFocus {

  /**
   * @param {HTMLElement} el
   */
  constructor( el ) {
    /** @type {number} */
    this.accumulatedTime = 0;
    /** @type {number} count of fixations > 150ms */
    this.focusCount = 0;
    /** @type {boolean} */
    this.focusRecorded = false;
    /** @type {number} */
    this.entries = 1;
    /** @type {number} */
    this.lastSample = window.performance.now();
    /** @type {boolean} */
    this.syllabified = false;
    /** @type {boolean} */
    this.pronounced = false;
    /** @type {boolean} */
    this.highlighted = false;
    /** @type {string} */
    this.word = this._getWordFromElement( el );
  }

  /**
   * @param {HTMLElement} el 
   * @returns {string}
   */
  _getWordFromElement( el ) {
    const textNodes = Array.from( el.childNodes ).filter( node => {
      if ( node.nodeType === Node.TEXT_NODE ) {
        return true;
      }
      if ( node.nodeType === Node.ELEMENT_NODE ) {
        return ! /** @type {Element} */ (node).classList.contains( 'hyphens' );
      }
      return false;
    } );

    return textNodes.map( node => node.textContent.trim() ).join( '' );
    // return textNodes[0].textContent.trim();
  }

};

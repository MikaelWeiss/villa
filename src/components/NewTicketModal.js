import styles from './NewTicketModal.module.css';

function NewTicketModal({ setIsOpen}) {
    return (
        <div className={styles.modalContainer}>
            <form className={styles.addForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="unit">Unit Number</label>
                    <input id="unit"
                        placeholder="e.g., A-203, B-105"
                        required="" 
                        type="text"/>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="title">What's Broken?</label>
                    <textarea
                        id="title"
                        placeholder="Implement Christen's svg stuff here"
                        rows="4"
                        required="" />
                </div>
                
                <div className={styles.formGroup}>
                    <label htmlFor="description">Damage Description</label>
                    <textarea
                    id="description" 
                    placeholder="Please describe the damage in detail..." 
                    rows="4" 
                    required="" />
                </div>
                
                <div className={styles.formActions}>
                    <button 
                        onClick={() => setIsOpen(false)}
                        type="button" 
                        className={styles.cancel}>
                        Cancel
                    </button>
                    <button 
                        onClick={() => setIsOpen(false)}
                        type="submit" 
                        className={styles.submit} 
                        disabled="">
                        Submit Report
                    </button>
                </div>
            </form>
        </div>
    )
}

export default NewTicketModal;
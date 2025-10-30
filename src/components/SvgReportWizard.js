
import React, { useState, useEffect, useMemo } from 'react';
import { getFloorPlan } from '../lib/floor-plan';
import './SvgReportWizard.css';

function SvgReportWizard({ onComplete, onPanelChange }) {
    const [panelIndex, setPanelIndex] = useState(0);
    const [issue, setIssue] = useState({ room: '', item: '', description: '' });
    const [itemOptions, setItemOptions] = useState([]);

    const floorPlanHtml = useMemo(() => getFloorPlan(), []);

    useEffect(() => {
        onPanelChange(panelIndex > 0);
    }, [panelIndex, onPanelChange]);

    function getDamageOptions(element) {
        let damageOptions = element.classList.value.split(' ');
        let parent = element.parentElement;
        let notDone = true;
        while (notDone) {
            if (parent.id === 'selectable') {
                notDone = false;
            } else {
                let inheritedDamageOptions = parent.classList.value.split(' ');
                for (let i = inheritedDamageOptions.length - 1; i > -1; i--) {
                    damageOptions.unshift(inheritedDamageOptions[i]);
                }
            }
            parent = parent.parentElement;
        }
        damageOptions = damageOptions.filter(Boolean);
        damageOptions.push('other');
        return damageOptions;
    }

    const handleFloorPlanClick = (e) => {
        const clickedElement = e.target;
        const selectableGroup = clickedElement.closest('#selectable > g > *');

        if (selectableGroup) {
            const room = selectableGroup.id;
            setIssue(prev => ({ ...prev, room }));
            const options = getDamageOptions(selectableGroup);
            setItemOptions(options);
            setPanelIndex(1);
        }
    };

    const handleItemClick = (item) => {
        setIssue(prev => ({ ...prev, item }));
        setPanelIndex(2);
    };

    const handleDescriptionSubmit = () => {
        onComplete(issue);
    };
    
    const handleDescriptionChange = (e) => {
        const description = e.target.value;
        setIssue(prev => ({ ...prev, description }));
    }

    const back = () => {
        if (panelIndex > 0) {
            setPanelIndex(prev => prev - 1);
        }
    };

    return (
        <div className="svg-wizard-container">
            <div className="wizard-header">
                 <div id="back-arrow" style={{ visibility: panelIndex > 0 ? 'visible' : 'hidden' }} onClick={back}>&larr;</div>
                 <h2 className="wizard-title">
                    {panelIndex === 0 && "Where is the issue?"}
                    {panelIndex === 1 && "What has the issue?"}
                    {panelIndex === 2 && "What is the issue?"}
                 </h2>
            </div>
            <div id="screen">
                <div id="room-of-issue" className="panel" style={{ display: panelIndex === 0 ? 'flex' : 'none' }}>
                    <div id="floor-plan" className="second" dangerouslySetInnerHTML={{ __html: floorPlanHtml }} onClick={handleFloorPlanClick} />
                </div>
                <div id="item-of-issue" className="panel" style={{ display: panelIndex === 1 ? 'flex' : 'none' }}>
                    <div id="item-options" className="second">
                        {itemOptions.map(option => (
                            <button key={option} type="button" onClick={() => handleItemClick(option)}>{option}</button>
                        ))}
                    </div>
                </div>
                <div id="description-of-issue" className="panel" style={{ display: panelIndex === 2 ? 'flex' : 'none' }}>
                    <textarea id="description-input" className="second w-full px-4 py-3 border rounded-lg transition-smooth focus-ring bg-white resize-vertical border-secondary-300 focus:border-primary" value={issue.description} onChange={handleDescriptionChange}></textarea>
                    <button id="submit-description-button" className="second" type="button" onClick={handleDescriptionSubmit}>Submit Description</button>
                </div>
            </div>
        </div>
    );
}

export default SvgReportWizard;

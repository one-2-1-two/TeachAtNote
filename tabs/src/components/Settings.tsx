import { useState } from 'react';
import { ISettingsProps, ISettingsState } from '../helper/IProps';
import { Form, FormDropdown } from '@fluentui/react-northstar'

const provinces = ['Bayern', 'Bremen', 'Hamburg', 'Hessen']
export function Settings(props: ISettingsProps) {
    const { province, selProvinceOnChange } = props;

    return(
        <Form
            onSubmit={() => {
                alert('Form submitted')
                }   
            }>
            <h1>Einstellungen</h1>
            <h3>Bundesland</h3>
            <FormDropdown 
                // label='Bundesland' 
                items={provinces}
                checkable
                getA11ySelectionMessage={
                    {
                        onAdd: item => `${item} has been selected.`,
                    }
                }
                value={province}
            />
        </Form>
    );
}
export default Settings;
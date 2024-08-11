import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@atlaskit/button/new';

const EmptyState = ({ name,  path }) => {
    const navigate = useNavigate();

    return <div>
        <p>No {name} found</p>
        <p>You haven't created any {name} yet. Start by creating a new {name} entry.</p>
        <Button appearance="primary" onClick={() => navigate(path)}>Create {name}</Button>
    </div>
}

export default EmptyState
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUp from './SignUp';
import CreateCompany from './CreateCompany';
import { useAuth } from '../../provider/authProvider';
import { serverUrl } from "../../utils/constants"

const SignUpPage = () => {

    const { setToken } = useAuth();
    const [isCreatingCompany, setIsCreatingCompany] = useState(false)
    const [user, setUser] = useState({})
    const navigate = useNavigate();

    const handleSignUp = useCallback(async (company) => {
        try {

            const newUser = {
                email: user.email,
                password: user.password,
                name: company.companyName,
                abn: company.abn,
                address: company.address,
                postcode: company.postcode
            }
            const response = await fetch(`${serverUrl}/users`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(newUser),
            });
      
            if (!response.ok) {
              throw new Error('Failed to create user');
            }
            
            const responseJSON = await response.json()
            setToken(responseJSON.jwt)
      
            navigate('/dashboard')
          } catch (error) {
            console.error('Error saving journal:', error);
          }
    }, [user, navigate, setToken])

    if (!isCreatingCompany) {
        return <SignUp
            onSubmit={(user) => {
                setIsCreatingCompany(true)
                setUser(user)
            }}
        />
    }

    return <CreateCompany onSuccess={handleSignUp}  />
};

export default SignUpPage;

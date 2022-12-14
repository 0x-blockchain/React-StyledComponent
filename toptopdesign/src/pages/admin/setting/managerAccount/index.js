import React, { useEffect, useState, useCallback } from 'react';
import { managerBar } from '../../../../assets/config';
import { Styles } from './style';
import { ReactComponent as RightArrowIcon } from '../../../../assets/img/admin/right_arrow.svg';
import { useNavigate } from 'react-router-dom';
import Profile from './profile';
import Level from './level';
import { withStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import { createManager, uploadAvatar } from '../../../../api/admin/users';
import { ToastContainer, toast } from 'react-toastify';
import { injectStyle } from "react-toastify/dist/inject-style";

const ColorButton = withStyles((theme) => ({
    root: {
        textTransform: 'none',
        border: '1px solid #EBEAED !important',
        color: `var(--second) !important`,
        fontFamily: `var(--font-family-manrope) !important`,
        fontSize: `var(--font-size-14) !important`,
        fontWeight: '600px !important',
        fontStyle: 'normal !important',
        height: '48px !important',
        display: 'flex !important',
        justifyContent: 'center !important',
        alignItems: 'center !important',
        borderRadius: '4px !important',
        cursor: 'pointer !important',
        '&:hover': {
            opacity: '.7 !important',
            color: `var(--white) !important`,
            backgroundColor: `var(--second) !important`
        },
    },
}))(Button);

const CreateButton = withStyles((theme) => ({
    root: {
        textTransform: 'none',
        border: '1px solid #EBEAED !important',
        color: `var(--white) !important`,
        fontFamily: `var(--font-family-manrope) !important`,
        fontSize: `var(--font-size-14) !important`,
        fontWeight: '600px !important',
        fontStyle: 'normal !important',
        height: '48px !important',
        display: 'flex !important',
        justifyContent: 'center !important',
        alignItems: 'center !important',
        borderRadius: '4px !important',
        cursor: 'pointer !important',
        width: '138px !important',
        backgroundColor: 'var(--ocean-blue-pearl)',
        '&:hover': {
            opacity: '.7 !important',
            color: `var(--white) !important`,
            backgroundColor: `var(--purple) !important`
        },
    },
}))(Button);

export default function ManagerAccount(){
    const navigate = useNavigate();
    const [currentIdx, setCurrentIdx] = useState(0);
    const [profile, setProfile] = useState({});
    const [accessLevel, setAccessLevel] = useState({});
    const [isFulled, setIsFulled] = useState(false);

    const handleClick = (idx) => {
        setCurrentIdx(idx);
    }

    if (typeof window !== "undefined") {
        injectStyle();
    }

    const uploadImage = useCallback(async() => {
        const formData = new FormData()
        formData.append('image', profile?.userAvatar);
        return await uploadAvatar(formData);
    }, [profile?.userAvatar])

    const goToMain = () => {
        navigate('/admin/setting/accounts');
    }

    function ValidateEmail(input) {
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (input.match(validRegex)) {
          return true;
        } else {
          return false;
        }
    }

    const saveManagerInfo = async() => {
        function isAlphaOrParen(str) {
            return /[a-zA-Z]/.test(str);
        }
        
        function containsNumber(str) {
            return /\d/.test(str);
        }
        if(isAlphaOrParen(profile?.newPassword) && containsNumber(profile?.newPassword) && profile?.newPassword.length >= 8){
            const res = await uploadImage();
            const result = await createManager(
                { ...profile, avatarPath: res?.filePath }, 
            );
            if(result.status === 200){
                await toast.warn('user created!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                await setTimeout(goToMain, 3000);
            }else{
                toast.warn('Failed!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }else{
            toast.warn('Password type error!', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    }

    const next = async() => {
        if(isFulled){
            if(profile?.oldPassword !== profile?.newPassword){
                toast.warn('Password not matched!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }
            if(!ValidateEmail(profile?.email)){
                toast.warn('Please type correct email!', {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }
        }
        if(currentIdx < managerBar.length - 1)
            setCurrentIdx(currentIdx + 1);
    }

    useEffect(() => {
        if(profile?.userAvatarPath && profile?.firstName && profile?.lastName &&
            profile?.userName && profile?.email &&
            profile?.oldPassword && profile?.newPassword)
            setIsFulled(true);
        else
            setIsFulled(false);
    }, [profile?.email, profile?.firstName, profile?.lastName, profile.location, profile?.newPassword, profile?.oldPassword, profile.shortBio, profile?.userAvatarPath, profile?.userName])

    return (
        <Styles>
            <div className='account-container'>
                <div className='account-header'>
                    <div className='first-line'>
                        <span style={{color: '#B6B4BA', cursor: 'pointer'}} onClick={() => navigate('/admin/setting/accounts/')}>Setting / Accounts </span>
                        <span>/ New Manager</span>
                    </div>
                    <div className='second-line'>
                        New Manager
                    </div>
                </div>
                <div className='account-body'>
                    <div className='left-panel'>
                        {currentIdx === 0 && 
                            <Profile
                                profile={profile}
                                setProfile={setProfile}
                            />
                        }
                        {currentIdx === 1 && 
                            <Level
                                accessLevel={accessLevel}
                                setAccessLevel={setAccessLevel}
                            />
                        }
                        <div className='left-panel-footer'>
                            <ColorButton onClick={() => navigate('/admin/setting/accounts')}>
                                Discard
                            </ColorButton>
                            {isFulled && currentIdx === 1?
                                <CreateButton 
                                    className='ml-24'
                                    onClick={() => saveManagerInfo()}
                                >
                                    Create
                                </CreateButton>:
                                <ColorButton 
                                    className='ml-24'
                                    onClick={() => next()}
                                >
                                    Next
                                </ColorButton>
                            }
                            
                        </div>
                    </div>
                    <div className='right-panel'>
                        <div className='right-panel-header'>
                            Account
                        </div>
                        <div className='form-group'>
                            {managerBar.map((item, idx) => {
                                return (
                                    <div 
                                        className='account-btn' 
                                        key={idx}
                                        onClick={() => handleClick(idx)}
                                    >
                                        {currentIdx !== idx?React.createElement(item.icon, { width: 40, height: 40 }):React.createElement(item.focusIcon, { width: 40, height: 40 })}
                                        <div className={currentIdx !== idx?'label':'label active'}>{item.label}</div>
                                        <RightArrowIcon className='icon'/>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </Styles>
    )
}
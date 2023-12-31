import React, { useEffect, useRef, useState } from 'react';
import { fetchGlobalDatas, fetchLocalDatas } from '../../utils/commonApi';
import { checkIsArray, findLocation } from '../../utils/commonFunction';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/ContextProvider';

const Register = ({ setDineRegisterModal }) => {

    const { diningId } = useAuth();
    console.log('dining idddddddddddddd', diningId)


    const [subjects, setSubjects] = useState([]);
    const [division, setDivision] = useState([]);
    const [district, setDistrict] = useState([]);
    const [upazilla, setUpazilla] = useState([]);
    const [union, setUnion] = useState([]);

    const [selectedDivision, setSelectedDivision] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedUpazilla, setSelectedUpazilla] = useState('');
    const [selectedUnion, setSelectedUnion] = useState('');


    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [studentImg, setStudentImg] = useState(null);

console.log('aaaaaaaaaaaaaa', studentImg)
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);

            try {

                const response = await fetchLocalDatas('/subjects.json');

                setSubjects(response)
                setError(null);


                const [divisionRes, districtRes, upazillaRes, unionsRes] = await Promise.all([
                    fetchLocalDatas('/divisions.json'),
                    fetchLocalDatas('/districts.json'),
                    fetchLocalDatas('/upazilas.json'),
                    fetchLocalDatas('/unions.json')
                ]);

                setDivision(divisionRes[2].data);
                setError(null);


                if (selectedDivision) {
                    const divisionId = findLocation(divisionRes[2], districtRes[2], selectedDivision);
                    const districtId = findLocation(districtRes[2], upazillaRes[2], selectedDistrict);
                    const upazilaId = findLocation(upazillaRes[2], unionsRes[2], selectedUpazilla);


                    if (divisionId && districtId && upazilaId) {
                        setDistrict(divisionId);
                        setUpazilla(districtId);
                        setUnion(upazilaId);
                    }
                    else {
                        setDistrict([]);
                        setUpazilla([]);
                        setUnion([]);
                        console.error('Something is wrong')
                    }
                }

            } catch (error) {
                setError(error.message);
                setDivision([]);
                setDistrict([]);
                setUpazilla([]);
                setUnion([]);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [selectedDivision, selectedDistrict, selectedUpazilla]);


    if (isLoading) {
        // return <Loading />;
    }
    else if (error) {
        return <div>Error: {error}</div>;
    }


    // Check is array?
    checkIsArray(division)
    checkIsArray(district)
    checkIsArray(upazilla)
    checkIsArray(union)



    const handleStudentRegister = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        formData.append('diningId', diningId);

        // Address sub-fields
        formData.append('address[father]', formData.get('father'));
        formData.append('address[mother]', formData.get('mother'));
        formData.append('address[divisionValue]', selectedDivision);
        formData.append('address[districtValue]', selectedDistrict);
        formData.append('address[subDistrictValue]', selectedUpazilla);
        formData.append('address[allianceValue]', selectedUnion);
        formData.append('address[village]', formData.get('village'));


        for(const [key, value] of formData){
           if(!value){
            alert(`value missing for ${key}`)
           };
           return;
        }


        fetch('http://localhost:5000/student/add', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });



        //     const studentId = e.target.studentId.value;
        //     const name = e.target.name.value;
        //     const gender = e.target.elements.gender.value;
        //     const roomNumber = e.target.roomNumber.value;
        //     const session = e.target.session.value;
        //     const status = e.target.elements.status.value?.toLowerCase();
        //     const department = e.target.elements.department.value;
        //     const admissionFee = e.target.admission.value;
        //     const emailOrPhoneNumber = e.target.emailOrPhoneNumber.value;
        //     const father = e.target.father.value;
        //     const mother = e.target.mother.value;
        //     const divisionValue = selectedDivision;
        //     const districtValue = selectedDistrict;
        //     const subDistrictValue = selectedUpazilla;
        //     const allianceValue = selectedUnion;
        //     const village = e.target.village.value;
        //     // const studentImg = e.target.img.files[0];



        //     const newStudent = {
        //         diningId,
        //         // studentImg,
        //         studentId,
        //         name,
        //         gender,
        //         roomNumber,
        //         session,
        //         status,
        //         department,
        //         admissionFee,
        //         emailOrPhoneNumber,
        //         address: {
        //             father,
        //             mother,
        //             divisionValue,
        //             districtValue,
        //             subDistrictValue,
        //             allianceValue,
        //             village
        //         }
        //     };



        //     for (const key in newStudent){
        //         if(newStudent[key] === ''){
        //             console.log(`Value for key ${key} is empty.`);
        //         }
        //     }


        // //    console.log('imageeeeeeeeeeeee', studentImg)
        //     const postData = await fetchGlobalDatas(newStudent, 'student/add', 'POST');
        //     console.log('sssss', postData)
        //     alert('Student created Successfull', postData)
    };




    return (
        <div className='flex justify-center items-center h-screen w-screen fixed'>

            <button onClick={() => setDineRegisterModal(false)} className="btn btn-circle absolute z-10 right-7 top-7">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className='h-screen w-screen bg-black opacity-60 absolute top-0'></div>
            <div className='bg-white h-[500px]  w-[1050px] absolute flex justify-center flex-col overflow-y-auto py-10 pt-96'>
                <h1 className='text-4xl mb-10'>Add a new Student</h1>
                <form onSubmit={handleStudentRegister} className='flex justify-center items-center flex-col'>

                    <div className='flex flex-col justify-center items-evenly'>
                        {/* <h2 className='text-xl font-semibold mb-4'>Student Information</h2> */}

                        <div className='text-start grid grid-cols-4 gap-4'>


                            <div>
                                <p className='mb-1'>Student ID</p>
                                <input name='studentId' type="text" placeholder="Type here" className="input input-bordered input-success w-full h-10 max-w-xs mb-4" />
                            </div>

                            <div>
                                <p className='mb-1'>Name</p>
                                <input name='name' type="text" placeholder="Type here" className="input input-bordered input-success w-full h-10 max-w-xs mb-4" />
                            </div>

                            <div>
                                <p className='mb-1'>Select Gender</p>
                                <select name='gender' className="select select-success w-full select-sm h-10 max-w-xs mb-4">
                                    <option>Male</option>
                                    <option>Female</option>
                                </select>
                            </div>

                            <div>
                                <p className='mb-1'>Room Number</p>
                                <input name='roomNumber' type="text" placeholder="Type here" className="input input-bordered input-success w-full h-10 max-w-xs mb-4" />
                            </div>

                            <div>
                                <p className='mb-1'>Session</p>
                                <input name='session' type="text" placeholder="Type here" className="input input-bordered input-success w-full h-10 max-w-xs mb-4" />
                            </div>


                            <div>
                                <p className='mb-1'>Student Status</p>
                                <select name='status' className="select select-success w-full select-sm h-10 max-w-xs mb-4">
                                    <option>Active</option>
                                    <option>Inactive</option>
                                </select>
                            </div>


                            <div>
                                <p className='mb-1'>Select Department</p>
                                <select name='department' className="select select-success w-full select-sm h-10 max-w-xs mb-4">
                                    <option disabled selected value=''>Department</option>
                                    {
                                        subjects.map((subject, i) => <option key={i}>{subject}</option>)
                                    }
                                </select>
                            </div>

                            <div>
                                <p className='mb-1'>Admission fee</p>
                                <input name='admissionFee' type="number" placeholder="Type here" className="input input-bordered input-success w-full h-10 max-w-xs mb-4" />
                            </div>

                            <div>
                                <p className='mb-1'>Phone Number</p>
                                <input name='emailOrPhoneNumber' type="text" placeholder="Type here" className="input input-bordered input-success w-full h-10 max-w-xs mb-4" />
                            </div>

                            <div>
                                <p className='mb-1'>Father Name</p>
                                <input name='father' type="text" placeholder="Type here" className="input input-bordered input-success w-full h-10 max-w-xs mb-4" />
                            </div>

                            <div>
                                <p className='mb-1'>Mother Name</p>
                                <input name='mother' type="text" placeholder="Type here" className="input input-bordered input-success w-full h-10 max-w-xs mb-4" />
                            </div>

                            <div>
                                <p className='mb-1'>Division</p>

                                <select value={selectedDivision ? selectedDivision : 'Select Dining Division'} onChange={(e) => setSelectedDivision(e.target.value)} className="select select-secondary w-full select-sm h-10 max-w-xs">
                                    <option disabled selected>Select Dining Division</option>
                                    {division.map((divisions, i) => (
                                        <option key={i}>{divisions.name}</option>
                                    ))}
                                </select>
                            </div>



                            <div>
                                <p className='mb-1'>District</p>

                                <select value={selectedDistrict ? selectedDistrict : 'District'} disabled={!selectedDivision} onChange={(e) => setSelectedDistrict(e.target.value)} className="select select-secondary w-full select-sm h-10 max-w-xs">
                                    <option disabled selected>District</option>
                                    {
                                        district &&
                                        district?.map((districts, i) => (<option key={i}>{districts?.name}</option>))
                                    }
                                </select>
                            </div>


                            <div>
                                <p className='mb-1'>Sub-District</p>

                                <select value={selectedUpazilla ? selectedUpazilla : 'Sub-District'} disabled={!selectedDistrict} onChange={(e) => setSelectedUpazilla(e.target.value)} className="select select-secondary w-full select-sm h-10 max-w-xs">
                                    <option disabled selected>Sub-District</option>
                                    {
                                        upazilla.map((upazilas, i) => (<option key={i}>{upazilas.name}</option>))
                                    }
                                </select>
                            </div>


                            <div>
                                <p className='mb-1'>Alliance</p>

                                <select value={selectedUnion ? selectedUnion : 'Alliance'} disabled={!selectedUpazilla} onChange={(e) => setSelectedUnion(e.target.value)} className="select select-secondary w-full select-sm h-10 max-w-xs mb-4">
                                    <option disabled selected>Alliance</option>
                                    {
                                        union.map((unions, i) => (<option key={i}>{unions.name}</option>))
                                    }
                                </select>
                            </div>

                            <div>
                                <p className='mb-1'>Village</p>
                                <input name='village' type="text" placeholder="Type here" className="input input-bordered input-success w-full h-10 max-w-xs mb-4" />
                            </div>

                        </div>
                        <div className='mt-5 mb-10 flex justify-center items-center'>
                         {
                            studentImg? <div>
                                <img  src={URL.createObjectURL(studentImg)} alt="Student" className="max-h-52 max-w-44 p-1 rounded cursor-pointer bg-blue-400 hover:bg-blue-700 "></img>
                          {studentImg &&  <label htmlFor='file-input' className='cursor-pointer bg-blue-500 hover:bg-blue-700 flex justify-center items-center text-sm text-white font-bold py-2 px-4 rounded mt-1'>Change image?</label>}
                            </div> : <label htmlFor='file-input' className="cursor-pointer bg-blue-500 hover:bg-blue-700 flex justify-center items-center text-lg text-white font-bold py-2 px-4 rounded w-44 h-52 block">Choose a Photo</label>
                         }

                            <input onChange={(e) => setStudentImg(e.target.files[0])} id='file-input' name='img' type="file" placeholder="Type here" className='hidden'/>
                        </div>
                    </div>

                    <button className='btn'>Submit</button>
                </form>

            </div>
        </div>
    );
};

export default Register;
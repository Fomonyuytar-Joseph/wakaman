import React, { useEffect, useState } from "react";

import OneWayCard from "../../components/card/one-way/OneWayCard";
import Header from "../../components/common/header/Header";
import Button from "../../components/common/button/Button";
import ModalContainer from "../../components/common/modal/modal-container/ModalContainer";
import AddOneWayModal from "../../components/common/modal/agency/add-one-ticket/AddOneWayModal";
import { oneWayTicketsInfo } from "../../store/oneWayTickets/oneWayTicketsSlice";
import {
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase-config";
import { useSelector, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import EditOneWayModal from "../../components/common/modal/agency/add-one-ticket/EditOneWayModal";
import { agencyInfo } from "../../store/agency/agencySlice";
// import { oneWayTicketsInfo } from "../../store/oneWayTickets/oneWayTicketsSlice";
const AgencyOneWayPage = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [ticketsList, setTicketsList] = useState([]);
  const [editTicketsList, setEditTicketsList] = useState({});
  const [currentEmail, setCurrentEmail] = useState("");
  const [trigger, setTrigger] = useState(false);
  const [purchasedTicketsList, setPurchasedTicketsList] = useState([]);

  const [presentUser, setPresentUser] = useState({});

  const agencySlice = useSelector((state) => state.agency);
  const ticketsSlice = useSelector((state) => state.oneWayTickets);

  const agencyRef = collection(db, "agency");

  const handleEditTicket = (ticket) => {
    setEditTicketsList(ticket);
    setShow(true);
  };

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setCurrentEmail(currentUser.email);
    });
  }, []);

  // console.log(currentEmail);

  // console.log(agencySlice)

  // // console.log(ticketsList);
  useEffect(() => {
    // const getAgency = async () => {
    //   onAuthStateChanged(auth, (currentUser) => {
    //     setCurrentEmail(currentUser.email);
    //   });

    //   const q = query(agencyRef, where("email", "==", currentEmail));
    //   const querySnapshot = await getDocs(q);
    //   setPresentUser(
    //     querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    //   );
    //   querySnapshot.forEach((doc) => {
    //     console.log(doc.id, " => ", doc.data());
    //     //  dispatch(customerInfo(doc.data()));

    //     dispatch(agencyInfo(doc.data()));
    //   });
    // };

    // getAgency();
    const timeout = setTimeout(() => {
      const getOneWayTickets = async () => {
        const oneWayTicketsRef = collection(db, "oneWayTickets");
        try {
          const q = query(
            oneWayTicketsRef,
            where("agencyEmail", "==", currentEmail)
          );

          const data = await getDocs(q);
          setTicketsList(
            data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
          );

          setShow(false);
        } catch (err) {
          console.log(err.message);
        }
      };

      getOneWayTickets();
    }, 1500);

    return () => clearTimeout(timeout);
  }, [currentEmail]);

  useEffect(() => {
    const getPurchasedTickets = async () => {
      const purchasedTicketsRef = collection(db, "oneWayTickets");
      try {
        const q = query(
          purchasedTicketsRef,
          where("agencyEmail", "==", currentEmail)
        );

        const data = await getDocs(q);
        setPurchasedTicketsList(
          data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        );

        // setShow(false);
      } catch (err) {
        console.log(err.message);
      }
    };

    getPurchasedTickets();
  }, [currentEmail]);

  // console.log(ticketsList);
  // console.log(editTicketsList);

  dispatch(oneWayTicketsInfo(ticketsList));

  // console.log(ticketsSlice);

  const closeModal = () => {
    setShow(false);
  };
  const closeEditModal = () => {
    setEditShow(false);
  };

  const deleteTicket = async (id) => {
    try {
      const docRef = doc(db, "oneWayTickets", id);
      await deleteDoc(docRef);
      setTrigger(!trigger);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="bg-white h-screen">
      <Header label={"One Way Tickets"} />

      <div className="flex justify-end px-5">
        <Button
          text={"Add A One Way Ticket"}
          buttonType={"PRIMARY"}
          onClick={() => setShow(true)}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-10 mt-10">
        {ticketsList?.map((ticket, index) => {
          return (
            <div key={index}>
              <OneWayCard
                key={index}
                forAgency={true}
                from={ticket.from}
                to={ticket.to}
                price={ticket.price}
                agencyName={ticket.agencyName}
                busType={ticket.busType}
                departureDate={ticket.departureDate}
                departureTime={ticket.departureTime}
                availableSeats={ticket.availableSeats}
                deleteTicket={() => deleteTicket(ticket.id)}
                handleEditTicket={() => handleEditTicket(ticket)}
                setShow={setShow}
                occupiedSeats={purchasedTicketsList.length}
              />
            </div>
          );
        })}
        {/* <OneWayCard forAgency={true} /> */}
      </div>

      <ModalContainer onClose={closeModal} width={"700px"} show={show}>
        <AddOneWayModal
          setShow={setShow}
          trigger={trigger}
          setTrigger={setTrigger}
          // editTicketsList={editTicketsList}

          // setEditTicketsList({})
        />
      </ModalContainer>
      <ModalContainer onClose={closeEditModal} width={"700px"} show={editShow}>
        <EditOneWayModal
          setShow={setEditShow}
          trigger={trigger}
          setTrigger={setTrigger}
          editTicketsList={editTicketsList}

          // setEditTicketsList({})
        />
      </ModalContainer>
    </div>
  );
};

export default AgencyOneWayPage;

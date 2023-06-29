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
// import { oneWayTicketsInfo } from "../../store/oneWayTickets/oneWayTicketsSlice";
const AgencyOneWayPage = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [ticketsList, setTicketsList] = useState([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [trigger, setTrigger] = useState(false);
  const agencySlice = useSelector((state) => state.agency);
  const ticketsSlice = useSelector((state) => state.oneWayTickets);

  // console.log(currentEmail);

  // console.log(agencySlice)

  // // console.log(ticketsList);
  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setCurrentEmail(currentUser.email);
    });

    const getOneWayTickets = async () => {
      const oneWayTicketsRef = collection(db, "oneWayTickets");
      try {
        const q = query(
          oneWayTicketsRef,
          where("agencyEmail", "==", currentEmail)
        );

        const data = await getDocs(q);
        setTicketsList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        setShow(false);
      } catch (err) {
        console.log(err.message);
      }
    };

    getOneWayTickets();
  }, [currentEmail, trigger]);

  console.log(ticketsList);

  dispatch(oneWayTicketsInfo(ticketsList));

  // console.log(ticketsSlice);

  const closeModal = () => {
    setShow(false);
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
            />
          );
        })}
        {/* <OneWayCard forAgency={true} /> */}
      </div>

      <ModalContainer onClose={closeModal} width={"700px"} show={show}>
        <AddOneWayModal
          setShow={setShow}
          trigger={trigger}
          setTrigger={setTrigger}
        />
      </ModalContainer>
    </div>
  );
};

export default AgencyOneWayPage;

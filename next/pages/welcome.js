import Header from "../components/header";

export default function Welcome() {
    return (
        <>
            <Header />
            <div className="px-10">
                Bem vindo ao CRUD de Keycloak com NextJs e Laravel! Esse projeto foi construido com o objetivo de estudar
                o funcionamento do Keycloak e integra-lo em um ambiente minimante real para que sirva de "Boilerplates" para
                projetos futuros.
            </div>
        </>
    );
}
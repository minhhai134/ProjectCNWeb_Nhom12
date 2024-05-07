import Proptypes from "prop-types";
import { FormProvider as Form, FormProvider } from "react-hook-form";

FormProvider.proptypes={
    children:Proptypes.node,
    methods: Proptypes.object,
    onSubmit: Proptypes.func,
}

export default function FormProvider({children,onSubmit,methods}){
    return(
        <Form {...methods}>
            <form onSubmit={onSubmit}>{children}</form>
        </Form>
    )
}
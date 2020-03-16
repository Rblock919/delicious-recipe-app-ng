import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { environment } from 'src/environments/environment';

// const uri = 'http://localhost:4000/';
const uri = environment.gqlPath;

export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({
      uri,
      withCredentials: true,
    }),
    cache: new InMemoryCache({
      addTypename: false,
    }),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
package com.je3l.repository.search;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryStringQuery;
import com.je3l.domain.ClientOrder;
import com.je3l.repository.ClientOrderRepository;
import java.util.stream.Stream;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.scheduling.annotation.Async;

/**
 * Spring Data Elasticsearch repository for the {@link ClientOrder} entity.
 */
public interface ClientOrderSearchRepository extends ElasticsearchRepository<ClientOrder, Long>, ClientOrderSearchRepositoryInternal {}

interface ClientOrderSearchRepositoryInternal {
    Stream<ClientOrder> search(String query);

    Stream<ClientOrder> search(Query query);

    @Async
    void index(ClientOrder entity);

    @Async
    void deleteFromIndexById(Long id);
}

class ClientOrderSearchRepositoryInternalImpl implements ClientOrderSearchRepositoryInternal {

    private final ElasticsearchTemplate elasticsearchTemplate;
    private final ClientOrderRepository repository;

    ClientOrderSearchRepositoryInternalImpl(ElasticsearchTemplate elasticsearchTemplate, ClientOrderRepository repository) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.repository = repository;
    }

    @Override
    public Stream<ClientOrder> search(String query) {
        NativeQuery nativeQuery = new NativeQuery(QueryStringQuery.of(qs -> qs.query(query))._toQuery());
        return search(nativeQuery);
    }

    @Override
    public Stream<ClientOrder> search(Query query) {
        return elasticsearchTemplate.search(query, ClientOrder.class).map(SearchHit::getContent).stream();
    }

    @Override
    public void index(ClientOrder entity) {
        repository.findById(entity.getId()).ifPresent(elasticsearchTemplate::save);
    }

    @Override
    public void deleteFromIndexById(Long id) {
        elasticsearchTemplate.delete(String.valueOf(id), ClientOrder.class);
    }
}

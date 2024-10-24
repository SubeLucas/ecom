package com.je3l.repository.search;

import co.elastic.clients.elasticsearch._types.query_dsl.QueryStringQuery;
import com.je3l.domain.OrderLine;
import com.je3l.repository.OrderLineRepository;
import java.util.stream.Stream;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchTemplate;
import org.springframework.data.elasticsearch.client.elc.NativeQuery;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.scheduling.annotation.Async;

/**
 * Spring Data Elasticsearch repository for the {@link OrderLine} entity.
 */
public interface OrderLineSearchRepository extends ElasticsearchRepository<OrderLine, Long>, OrderLineSearchRepositoryInternal {}

interface OrderLineSearchRepositoryInternal {
    Stream<OrderLine> search(String query);

    Stream<OrderLine> search(Query query);

    @Async
    void index(OrderLine entity);

    @Async
    void deleteFromIndexById(Long id);
}

class OrderLineSearchRepositoryInternalImpl implements OrderLineSearchRepositoryInternal {

    private final ElasticsearchTemplate elasticsearchTemplate;
    private final OrderLineRepository repository;

    OrderLineSearchRepositoryInternalImpl(ElasticsearchTemplate elasticsearchTemplate, OrderLineRepository repository) {
        this.elasticsearchTemplate = elasticsearchTemplate;
        this.repository = repository;
    }

    @Override
    public Stream<OrderLine> search(String query) {
        NativeQuery nativeQuery = new NativeQuery(QueryStringQuery.of(qs -> qs.query(query))._toQuery());
        return search(nativeQuery);
    }

    @Override
    public Stream<OrderLine> search(Query query) {
        return elasticsearchTemplate.search(query, OrderLine.class).map(SearchHit::getContent).stream();
    }

    @Override
    public void index(OrderLine entity) {
        repository.findById(entity.getId()).ifPresent(elasticsearchTemplate::save);
    }

    @Override
    public void deleteFromIndexById(Long id) {
        elasticsearchTemplate.delete(String.valueOf(id), OrderLine.class);
    }
}
